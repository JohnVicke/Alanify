import React, { useEffect, useState, createRef } from "react";
import { withRouter } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import wordsToNumbers from "words-to-numbers";

import SpotifyWebApi from "spotify-web-api-js";
import alanBtn from "@alan-ai/alan-sdk-web";

import "../App.css";
import { IconButton, Box, Button, Container, Grid, makeStyles, Typography, Collapse, Slide } from "@material-ui/core";
import PlaylistCard from "../components/PlaylistCard";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 1rem",
    background: "#30333C",
    height: "100%",
    minHeight: "100vh",
  },

  toast: {
    marginBottom: "4rem",
  },
  info: {
    padding: "5rem 0",
    color: "#F4E4CC",
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

const Landing = (props) => {
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({ name: "", albumArt: "", artists: [], uri: "" });
  const [me, setMe] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

    const { accessToken, refreshToken } = props.match.params;

    if (accessToken) {
      spotify.setAccessToken(accessToken);
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

        const max = 3;
        let counter = 0;

        const interval = setInterval(() => {
          counter++;
          if (counter > max) {
            newItems[i - 1] = { ...newItems[i - 1], added: false };
            setPlaylists({ ...playlists, items: newItems });
            clearInterval(interval);
            setToastMsg(`Added ${np.name} to ${locPlaylists.items[i - 1].name}!`);
            setOpen(true);
          }
        }, 1000);
      } catch (e) {
        console.log(e);
      }

      instance.callProjectApi(
        "setPlaylistName",
        { value: { songName: np.name, playlistName: locPlaylists.items[i - 1].name } },
        function (error, result) {
          if (error) {
            alert(error);
          }
        }
      );
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

  if (!playlists) {
    <div>Loading...</div>;
  }

  const setSpecificAdded = async () => {
    const newItems = playlists.items;
    newItems[10] = { ...newItems[10], added: true };
    setPlaylists({ ...playlists, items: newItems });
    const max = 3;
    let counter = 0;

    const interval = setInterval(() => {
      counter++;
      if (counter > max) {
        newItems[10] = { ...newItems[10], added: false };
        setPlaylists({ ...playlists, items: newItems });
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box className={classes.info}>
            <Typography variant="h1">Alanify</Typography>
          </Box>
          <Collapse in={open}>
            <Alert className={classes.toast} action={<Button onClick={() => setOpen(false)}>Close</Button>}>
              {toastMsg}
            </Alert>
          </Collapse>
          {playlists && (
            <Grid container spacing={6}>
              {playlists.items.map((playlist, i) => (
                <Slide key={playlist.id} in={true} timeout={i * 200} direction="right">
                  <Grid item xs={12} sm={6} md={3}>
                    <PlaylistCard playlist={playlist} idx={i + 1} added={playlist.added} />
                  </Grid>
                </Slide>
              ))}
            </Grid>
          )}
        </Container>
      </MuiThemeProvider>
    </div>
  );
};

export default withRouter(Landing);
