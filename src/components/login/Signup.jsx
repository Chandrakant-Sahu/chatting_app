import React, { useRef, useContext } from "react";
import "./Signup.css";
import { Button } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import Navbar, { toastNotificationStyle } from "../homepage/Navbar";
import { StateContext } from "../../StateProvider";
import { auth } from "../../Firebase";
import { actionTypes } from "../../reducer";
import { toast } from "react-toastify";

function Signup() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { state, dispatch } = useContext(StateContext);
  const history = useHistory();

  // NEW USER SIGN UP
  const handleSignUp = (e) => {
    e.preventDefault();
    dispatch({
      type: actionTypes.SIGN_UP,
      payload: {
        loading: true,
        error: false,
      },
    });
    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((result) => {
        result.user
          .updateProfile({
            displayName: usernameRef.current.value,
          })
          .then(() => {
            dispatch({
              type: actionTypes.SUCCESS,
              payload: {
                user: result.user,
                loading: false,
                error: false,
              },
            });
            history.push("/rooms");
            toast.success(`Sign up Success. `, { toastNotificationStyle });
          });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.ERROR,
          payload: {
            error: true,
            loading: false,
          },
        });
        toast.error(`Failed to Sign up. ${err.message}`, {
          toastNotificationStyle,
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="signup">
        <div className="signup__container">
          <h1>Sign up here</h1>
          <form onSubmit={handleSignUp}>
            <div className="signup__input">
              <input
                type="text"
                placeholder="Username"
                ref={usernameRef}
                required
              />
              <input type="email" placeholder="Email" ref={emailRef} required />
              <input
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
              />
              <Button type="submit" disabled={state.loading}>
                Sign Up
              </Button>
            </div>
          </form>
          <div className="signup__existingUser">
            <NavLink to="/login">Already have an account ? Sign In</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;

