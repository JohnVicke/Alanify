import { Box, Button, Container, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#30333c",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
  },
}));

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Button
          style={{
            margin: "0 auto",
            backgroundColor: "#f4e4cc",
            fontWeight: 800,
            color: "#30333c",
          }}
          variant="contained"
          color="#f4e4cc"
          onClick={() => history.push("/spotify")}
        >
          Continue with Spotify
        </Button>
      </Container>
    </Box>
  );
};

export default Login;
