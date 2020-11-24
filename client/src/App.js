import React, { useEffect, useState } from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import wordsToNumbers from "words-to-numbers";

import SpotifyWebApi from "spotify-web-api-js";
import alanBtn from "@alan-ai/alan-sdk-web";

import "./App.css";
import { Box, Button, Container, Grid, makeStyles } from "@material-ui/core";
import PlaylistCard from "./components/PlaylistCard";

const useStyles = makeStyles((theme) => ({
  info: {
    marginTop: "1rem",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#fff",
    },
  },
});

const App = () => {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ name: "", albumArt: "", artists: [], uri: "" });
  const [me, setMe] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  const classes = useStyles();

  const spotify = new SpotifyWebApi();

  useEffect(() => {
    const getMeAsync = async () => {
      try {
        const res = await spotify.getMe();
        setMe(res);
      } catch (e) {
        console.log(e);
      }
    };

    const { access_token } = getHashParams();

    if (access_token) {
      spotify.setAccessToken(access_token);
      getMeAsync();
      setSpotifyConnected(true);
    }
  }, []);

  useEffect(() => {
    const getPlaylistsAsync = async () => {
      try {
        const res = await spotify.getUserPlaylists();
        setPlaylists(res);
      } catch (e) {
        console.log("GET PLAYLISTSERROR: ", e);
      }
    };

    if (spotifyConnected) {
      getPlaylistsAsync();
    }
  }, [spotifyConnected]);

  useEffect(() => {
    const getCurrentSongCmd = async () => {
      const np = await getNowPlaying();
      instance.callProjectApi("setClientData", { value: np }, function (error, result) {
        if (error) {
          alert(error);
        }
      });
    };

    const addSongToPlaylistCmd = async (i) => {
      const locPlaylists = await getPlaylists();
      const playlistId = getPlaylistIdByIdx(locPlaylists, i - 1);
      const np = await getNowPlaying();

      console.log({ playlistid: playlistId });
      console.log({ nowplaying: np });
      try {
        const res = await spotify.addTracksToPlaylist(playlistId, [np.uri]);

        const newItems = locPlaylists.items;
        newItems[i - 1] = { ...newItems[i - 1], added: true };
        setPlaylists({ ...playlists, items: newItems });

        const max = 5;
        let counter = 0;

        const interval = setInterval(() => {
          counter++;
          if (counter > max) {
            newItems[i - 1] = { ...newItems[i - 1], added: false };
            setPlaylists({ ...playlists, items: newItems });
            clearInterval(interval);
          }
        }, 1000);
      } catch (e) {
        console.log(e);
      }
    };

    const instance = alanBtn({
      key: process.env.REACT_APP_ALAN_KEY,
      onCommand: ({ command, number }) => {
        switch (command) {
          case "getNowPlaying": {
            getCurrentSongCmd();
            break;
          }
          case "addToPlaylist": {
            if (typeof number === "string") {
              number = wordsToNumbers(number, { fuzzy: true });
            }
            addSongToPlaylistCmd(number);
            break;
          }
        }
      },
    });
  }, []);

  const getPlaylists = async () => {
    try {
      const res = await spotify.getUserPlaylists();
      return res;
    } catch (e) {
      return { error: e };
    }
  };

  const getPlaylistIdByIdx = (p, idx) => {
    return p.items[idx].id;
  };

  const getNowPlaying = async () => {
    try {
      const res = await spotify.getMyCurrentPlaybackState();
      console.log({ spotifySong: res });
      const now = { name: res.item.name, artists: res.item.artists, uri: res.item.uri };
      setNowPlaying({
        ...nowPlaying,
        name: res.item.name,
        albumArt: res.item.album.images[0].url,
        artists: res.item.artists,
        uri: res.item.uri,
      });
      return now;
    } catch (e) {
      console.log(e);
      return e;
    }
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

  if (!me) {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <Button onClick={() => window.location.assign("http://localhost:8888")}>Continue with Spotify!</Button>
        </MuiThemeProvider>
      </div>
    );
  }

  if (!playlists) {
    <div>Loading...</div>;
  }

  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box className={classes.info}></Box>
          {playlists && (
            <Grid container spacing={6}>
              {playlists.items.map((playlist, i) => (
                <Grid key={playlist.id} item xs={12} sm={6} md={3}>
                  <PlaylistCard playlist={playlist} idx={i + 1} added={playlist.added} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
