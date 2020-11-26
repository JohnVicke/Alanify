import { Button } from "@material-ui/core";
import React from "react";
import { withRouter, useHistory } from "react-router-dom";

const Error = (props) => {
  const history = useHistory();
  const { errorMsg } = props.match.params;
  console.log(props.match.params);
  return (
    <div>
      {errorMsg}
      <Button onClick={() => history.goBack()}>Go back</Button>
    </div>
  );
};

export default withRouter(Error);
