import React, { useContext, useRef } from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../Firebase";
import { StateContext } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { NavLink, useHistory } from "react-router-dom";
import Navbar, { toastNotificationStyle } from "../homepage/Navbar";
import { toast } from "react-toastify";

const Login = () => {
  const { state, dispatch } = useContext(StateContext);
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();

  // GOOGLE LOGIN
  const LogInWithGoogle = () => {
    dispatch({
      type: actionTypes.LOG_IN,
      payload: {
        loading: true,
        error: false,
      },
    });
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SUCCESS,
          payload: {
            user: result.user,
            loading: false,
            error: false,
          },
        });
        history.push("/rooms");
        toast.success(`Login Success. `, { toastNotificationStyle });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.ERROR,
          payload: {
            error: true,
            loading: false,
          },
        });
        toast.error(`Failed to log in. ${error.message}`, {
          toastNotificationStyle,
        });
      });
  };

  // LOGIN WITH EMAIL AND PASSWORD
  const LogInWithEmailAndPassword = (e) => {
    e.preventDefault();
    dispatch({
      type: actionTypes.LOG_IN,
      payload: {
        loading: true,
        error: false,
      },
    });
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((result) => {
        dispatch({
          type: actionTypes.SUCCESS,
          payload: {
            user: result.user,
            loading: false,
            error: false,
          },
        });
        toast.success(`Login Success. `, { toastNotificationStyle });
        history.push("/rooms");
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.ERROR,
          payload: {
            error: true,
            loading: false,
          },
        });
        toast.error(`Failed to log in. ${err.message}`, {
          toastNotificationStyle,
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="login">
        <div className="login__container">
          <div className="login__text">
            <h1>Sign in to Chat</h1>
          </div>
          <form onSubmit={LogInWithEmailAndPassword}>
            <div className="login__input">
              <input type="email" placeholder="Email" ref={emailRef} required />
              <input
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
              />
              <Button type="submit" disabled={state.loading}>
                Sign In
              </Button>
            </div>
            <div className="login__newUser">
              <NavLink exact to="/signup">
                New User ? Sign Up
              </NavLink>
            </div>
          </form>
          <div className="login__googleButton">
            <Button onClick={LogInWithGoogle} disabled={state.loading}>
              Sign in with Google <img src="img/google.png" alt="Google_logo" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
