const express = require('express');
const TwitterApi = require("twitter-api-v2").default;
const connect = require('./db/connect');
const verifier = require('./models/tauth')

 

const twitterClient = new TwitterApi({
    clientId: "djhNRzh0WEYxazJkRS1EUmFUM0U6MTpjaQ",
    clientSecret: "llmmUQaV9Wd9OqOoQOXjazr167r5VS0al30h2m9w6MIr5Xrnxi",
  });

const app = express();
var codv;

callbackURL = "http://127.0.0.1:3000/callback"
app.get('/auth',async(req,res) => {
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
        callbackURL,
        { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
      );
         
      await verifier.updateMany({}, { $set: { code_verifier: codeVerifier, state:state } });

      
      res.redirect(url);
})

app.get('/callback',async (request, response) => {
    const { state, code } = request.query;
   
    const verifierTokens = await verifier.find({});
    
    var codeVerifier = verifierTokens[0].code_verifier
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
    await verifier.updateMany({}, { $set: { access_token: accessToken, refresh_token:refreshToken } });
    const { data } = await loggedClient.v2.me(); // start using the client if you want
  
    response.send(data);
  })


app.get('/tweet',async(req, res)=>{
  const verifierTokens = await verifier.find({});
  const {tweetData} = req.query
  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(verifierTokens[0].refresh_token);

  await verifier.updateMany({}, { $set: { access_token: accessToken, refresh_token:newRefreshToken } });

  const { data } = await refreshedClient.v2.tweet(
     "tweeted"
  );

  res.redirect("https://twitter.com")
})

  const start = async () => {
  
    await connect("mongodb+srv://ak:ak@api.6qtls9v.mongodb.net/?retryWrites=true&w=majority");
  
    try {
      app.listen(2000);
      console.log("Server is running");
    } catch (error) {
      console.log(error.msg);
    }
  };
  
  //initiating the server with start function
  start();