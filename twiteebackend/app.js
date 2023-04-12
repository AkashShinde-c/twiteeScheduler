const express = require("express");
const cron = require("node-cron");
const TwitterApi = require("twitter-api-v2").default;
const connect = require("./db/connect");
const { verifier, User } = require("./models/tauth");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authCheck = require("./middleware/authCheck");

const twitterClient = new TwitterApi({
  clientId: "djhNRzh0WEYxazJkRS1EUmFUM0U6MTpjaQ",
  clientSecret: "llmmUQaV9Wd9OqOoQOXjazr167r5VS0al30h2m9w6MIr5Xrnxi",
});

tweetData =
[
  { text: "This is the first tweet." },
  { text: "Here's another unique tweet." },
  { text: "A third unique tweet." },
];

const app = express();
let id;
app.use(cors());

callbackURL = "http://127.0.0.1:2000/callback";
app.get("/auth", authCheck, async (req, res) => {
  // console.log(33);
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
  );

  await User.updateMany(
    { _id: req.user },
    { $set: { code_verifier: codeVerifier, state: state } }
  );
  console.log(req.user);
  id = req.user;
  // res.redirect(url);
  res.json({ url });
});

app.get("/callback", async (request, response) => {
  const { state, code } = request.query;

  const verifierTokens = await User.find({ _id: id });

  var codeVerifier = verifierTokens[0].code_verifier;

  // const dbSnapshot = await dbRef2.get();
  // const { codeVerifier, state: storedState } = dbSnapshot.data();

  if (state !== verifierTokens[0].state) {
    return response.status(400).send("Stored tokens do not match!");
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  // await dbRef.set({ accessToken, refreshToken });
  await User.updateOne(
    { _id: id },
    { $set: { access_token: accessToken, refresh_token: refreshToken } }
  );

  const { data } = await loggedClient.v2.me(); // start using the client if you want

  response.redirect("http://127.0.0.1:3000/#/dashboard");
  // response.send(data)
  // console.log(data);
});

app.get("/tweet",authCheck,async (req, res) => {
  const verifierTokens = await User.find({ _id: req.user });
  const { tweetData } = req.query;
  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(verifierTokens[0].refresh_token);

  await User.updateOne(
    { _id: id },
    { $set: { access_token: accessToken, refresh_token: newRefreshToken } }
  );
  const text = "Hello world! This is a scheduled tweet" + new Date().getTime();
  res.json({ msg: "Tweets are scheduled successfully" });
    cron.schedule('*/30 * * * * *', async () => {
    console.log("job scheduled");
    try {
      const { data } = await refreshedClient.v2.tweet(new Date().getTime().toString());
    } catch (e) {
      console.log(e);
    }
     
  });

  // const tweetText = 'This is a scheduled tweet using the Twitter API v2!';
  // const scheduledTime = '2023-03-23T12:00:00Z'; // Replace with your desired time

  // refreshedClient.v1.tweets.scheduleTweet({
  //   text: tweetText,
  //   scheduled_at: scheduledTime,
  //   auto_populate_reply_metadata: true
  // }).then((response) => {
  //   console.log('Scheduled tweet successfully:', response.data);
  // }).catch((error) => {
  //   console.error('Error scheduling tweet:', error);
  // });
 
});

app.use(express.json());

// Endpoint to create a new user
app.post("/api/users", async (req, res) => {
  const { email, password } = req.body;

  //check if user exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  //Create new user if not already existing
  const user = new User({ email, password });
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({ error: "Server error" });
  }

  console.log(email, password);
  res.status(201).json({ message: "User created successfully" });
});

//Endpoint to login
app.post("/login", async (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.json({ path: "/dashboard" });
  } else {
    try {
      const { email, password } = req.body;

      // Find the user in the database
      const user = await User.findOne({ email });

      // If user is not found or password is incorrect, send an error response
      if (!user || user.password != password) {
        return res
          .status(401)
          .json({ msg: "Invalid email or password", success: false });
      }

      // If user is found and password is correct, issue a JWT token
      const token = jwt.sign({ userId: user._id }, "secret");

      // Send the token in the response
      res.json({ token: token, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
});

// app.get('/dashboard',authCheck,async(req,res)=>{
//   res.redirect("localhost:3000/login");
// });

const start = async () => {
  await connect(
    "mongodb+srv://ak:ak@api.6qtls9v.mongodb.net/?retryWrites=true&w=majority"
  );

  try {
    app.listen(2000);
    console.log("Server is running");
  } catch (error) {
    console.log(error.msg);
  }
};

//initiating the server with start function
start();
