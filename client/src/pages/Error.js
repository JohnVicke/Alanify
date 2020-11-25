import React from "react";
import { withRouter } from "react-router-dom";

const Error = (props) => {
  const { errorMsg } = props.match.params;
  return <div>{errorMsg}</div>;
};

export default withRouter(Error);
