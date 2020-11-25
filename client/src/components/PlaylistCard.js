import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import "./animation.css";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    height: "100%",
    "& img": {
      width: "100%",
      opacity: "20%",
    },
  },
  name: {
    position: "absolute",
    top: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#F4E4CC",
    color: "#141414",
    width: "100%",
    padding: "10px",
    textAlign: "center",
    fontWeight: 800,
  },
  linear: {
    color: "#F4E4CC",
  },
  buttonProgress: {
    color: "#F4E4CC",
    position: "absolute",
    top: "-25px",
    right: "-25px",
    zIndex: 100,
  },
}));

const PlaylistCard = ({ playlist, idx, added }) => {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);
  const addedTimer = React.useRef();
  const successTimer = React.useRef();

  useEffect(() => {
    if (added) {
      console.log(added);
      addedTimer.current = window.setTimeout(() => {
        setSuccess(true);
      }, 3000);
    }
    return () => {
      clearTimeout(addedTimer.current);
    };
  }, [added]);

  useEffect(() => {
    if (success) {
      console.log({ succ: success });
      successTimer.current = window.setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }

    return () => {
      clearTimeout(successTimer.current);
    };
  }, [success]);

  const getClassName = () => {
    if (success) {
      return "index added success";
    }
    if (added) {
      return "index added";
    }

    return "index";
  };

  return (
    <div>
      <Box className={classes.root}>
        <img src={playlist.images[0].url} />
        <Typography className={classes.name}>{playlist.name}</Typography>
        {added && !success && <CircularProgress size={80} className={classes.buttonProgress} />}
        <p className={getClassName()}>{success ? "✓" : idx}</p>
      </Box>
    </div>
  );
};

export default PlaylistCard;
