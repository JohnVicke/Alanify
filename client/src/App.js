import React from "react";
import { BrowserRouter, Route, useHistory } from "react-router-dom";

import { createMuiTheme } from "@material-ui/core/styles";

import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

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
    <BrowserRouter history={history}>
      <Route exact path="/" component={Login} />
      <Route path="/user/:accessToken/:refreshToken" component={Landing} />
      <Route path="/error/:errorMsg" component={Error} />
    </BrowserRouter>
  );
};

export default App;
