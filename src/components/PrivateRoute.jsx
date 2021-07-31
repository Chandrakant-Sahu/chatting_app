import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { StateContext } from "../StateProvider";

function PrivateRoute({ component: Component, ...rest }) {
  const { state } = useContext(StateContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        state.user !== null ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  );
}

export default PrivateRoute;
