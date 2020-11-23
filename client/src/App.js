import React, { useEffect, useState } from "react";

import SpotifyWebApi from "spotify-web-api-js";
import alanBtn from "@alan-ai/alan-sdk-web";

import "./App.css";

const App = () => {
  const [alan, setAlan] = useState(null);
  const [spotify, setSpotify] = useState(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ name: "", albumArt: "", artists: [] });

  useEffect(() => {
    const { access_token } = getHashParams();
    console.log(access_token);
    const spotifyApi = new SpotifyWebApi();
    if (access_token) {
      spotifyApi.setAccessToken(access_token);
      setSpotify(spotifyApi);
      setSpotifyConnected(true);
    }
  }, []);

  useEffect(() => {
    setAlan(alanBtn({ key: process.env.REACT_APP_ALAN_KEY }));
  }, []);

  const getNowPlaying = () => {
    spotify.getMyCurrentPlaybackState().then((res) => {
      console.log(res.item.artists);
      setNowPlaying({
        ...nowPlaying,
        name: res.item.name,
        albumArt: res.item.album.images[0].url,
        artists: res.item.artists,
      });
    });
  };

  const getHashParams = () => {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  };

  return (
    <div className="App">
      <a href="http://localhost:8888"> Login to Spotify </a>
      <div>
        Now Playing: <strong>{nowPlaying.artists.map((x) => x.name).join(", ")} - </strong>
        {nowPlaying.name}
      </div>
      <div>
        <img src={nowPlaying.albumArt} style={{ height: 150 }} />
      </div>
      {spotifyConnected && <button onClick={getNowPlaying}>Check Now Playing</button>}
    </div>
  );
};

export default App;
