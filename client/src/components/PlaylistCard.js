import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import "./animation.css";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#141414",
    position: "relative",
    height: "100%",
    "& img": {
      width: "100%",
      opacity: "30%",
    },
  },
  name: {
    position: "absolute",
    top: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#141414",
    color: "#fff",
    width: "100%",
    padding: "10px",
    textAlign: "center",
    fontWeight: 800,
  },
}));

const PlaylistCard = ({ playlist, idx, added }) => {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.root}>
        <img src={playlist.images[0].url} />
        <Typography className={classes.name}>{playlist.name}</Typography>
        <p className={added ? "index added" : "index"}>{idx}</p>
      </Box>
    </div>
  );
};

export default PlaylistCard;
