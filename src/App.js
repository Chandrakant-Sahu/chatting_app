import React, { useContext, useEffect } from "react";
import "./App.css";
import ChatUI from "./components/ChatUI";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from "./Firebase";
import { actionTypes } from "./reducer";
import { StateContext } from "./StateProvider";
import Homepage from "./components/homepage/Homepage";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Features from "./components/homepage/Features";

const App = () => {
  const { dispatch } = useContext(StateContext);

  // EFFECT FOR SETTING USER ON FIREBASE ON-AUTH-STATE-CHANGED()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      dispatch({
        type: actionTypes.SUCCESS,
        payload: {
          user: currentUser,
          loading: false,
        },
      });
    });
    return unsubscribe;
  }, []);

  // CUSTOM STYLE FOR TOAST NOTIFICATION FONT SIZE
  const toastStyle = {
    fontSize: "4rem",
  };

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/features" component={Features} />
          <Route exact path="/rooms" component={ChatUI} />
          <Route exact path="/rooms/:roomId" component={ChatUI} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
        <ToastContainer style={toastStyle} />
      </div>
    </Router>
  );
};

export default App;
