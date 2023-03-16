const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Database reference
const dbRef = admin.firestore().doc("tokens/tauth");
const dbRef2 = admin.firestore().doc("tokens/verify");

// Twitter API init
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: "djhNRzh0WEYxazJkRS1EUmFUM0U6MTpjaQ",
  clientSecret: "llmmUQaV9Wd9OqOoQOXjazr167r5VS0al30h2m9w6MIr5Xrnxi",
});

const callbackURL = "http://127.0.0.1:5000/twitee-12032/us-central1/callback";

// STEP 1 - Auth URL
exports.auth = functions.https.onRequest(async (request, response) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
  );

  // store verifier
  await dbRef2.set({ codeVerifier, state });

  response.redirect(
    // "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=djhNRzh0WEYxazJkRS1EUmFUM0U6MTpjaQ&redirect_uri=http://127.0.0.1:5000/twitee-12032/us-central1/callback&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain"
 url );
});

// STEP 2 - Verify callback code, store access_token
exports.callback = functions.https.onRequest(async (request, response) => {
  const { state, code } = request.query;
    console.log(state)
  const dbSnapshot = await dbRef2.get();
  const { codeVerifier, state: storedState } = dbSnapshot.data();

 if (state !== storedState) {
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

  await dbRef.set({ accessToken, refreshToken });

  const { data } = await loggedClient.v2.me(); // start using the client if you want

  response.send(data);
});

// STEP 3 - Refresh tokens and post tweets
exports.tweet = functions.https.onRequest(async (request, response) => {
  const { refreshToken } = (await dbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await dbRef.set({ accessToken, refreshToken: newRefreshToken });

     const { data } = await refreshedClient.v2.tweet(
      "Works"
    );

    response.send(data);
});
