const express = require("express");
const request = require("request");
const Spotify = require("spotify-web-api-node");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const STATE_KEY = "spotify_auth_state";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-modify-private",
];

const spotifyApi = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.SPOTIFY_REDIRECT_URL_PROD}/callback`,
});

const generateRandomString = (N) => (Math.random().toString(36) + Array(N).join("0")).slice(2, N + 2);

const app = express();

app.use(cors());
app.use(cookieParser());

app.get("/spotify", (_, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

app.get("/callback", (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  if (state === null || state !== storedState) {
    res.redirect(`${process.env.SPOTIFY_REDIRECT_URL_PROD}/error/statemismatch`);
  } else {
    res.clearCookie(STATE_KEY);
    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        const { expires_in, access_token, refresh_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        spotifyApi.getMe().then(({ body }) => {
          console.log(body);
        });
        res.redirect(`${process.env.SPOTIFY_REDIRECT_URL_PROD}/user/${access_token}/${refresh_token}`);
      })
      .catch((err) => {
        res.redirect(`${process.env.SPOTIFY_REDIRECT_URL_PROD}/error/invalidtoken`);
      });
  }
});

app.get("/refresh_token", (req, res) => {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: { Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64") },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

console.log("Listening on 8888");
app.listen(process.env.PORT || 8888);
