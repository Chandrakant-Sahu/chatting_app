import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const toastNotificationStyle = {
  position: "top-right",
  width: "100%",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="navbar__appName">
          <NavLink exact to="/">
            <h2>
              HOM<span>ER</span>
            </h2>
          </NavLink>
        </div>
        <div className="navbar__items">
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </div>
      </div>
    </>
  );
}

export default Navbar;
