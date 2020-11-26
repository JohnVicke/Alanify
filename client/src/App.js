import React from "react";
import { HashRouter as Router, Route, useHistory } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";

import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Error from "./pages/Error";

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

const App = (props) => {
  const history = useHistory();
  return (
    <Router history={history}>
      <Route exact path="/" component={Login} />
      <Route path="/user/:accessToken/:refreshToken" component={Landing} />
      <Route path="/error/:errorMsg" component={Error} />
    </Router>
  );
};

export default App;
