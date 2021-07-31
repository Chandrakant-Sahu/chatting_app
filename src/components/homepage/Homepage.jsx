import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { Button } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import Loader from "react-loader-spinner";

function Homepage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loader">
          <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <>
          <Navbar />
          <div className="homepage__container">
            <div className="homepage__mainSection">
              <div className="home__image">
                <img src="img/chat.png" alt="chat_image" />
              </div>
              <div className="home__appDescription">
                <h3>Simple, Secure, </h3>
                <h3>Reliable Messaging</h3>
                <p>
                  Chat app messaging as powerful as any other application.
                  <br /> You can chat freely with anyone anytime forever.
                </p>
                <div className="home__getStarted">
                  <NavLink to="/login">
                    <Button className="getStarted__btn">Start now</Button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Homepage;
