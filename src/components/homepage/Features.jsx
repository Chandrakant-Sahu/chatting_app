import React from "react";
import Cards from "./Cards";
import "./Features.css";
import Navbar from "./Navbar";

function Features() {
  const features = [
    {
      id: 1,
      title: "Realtime Chatting",
      text: "Enjoy realtime chatting with anyone around the globe",
      imgSrc: "img/realtime.png",
      imgAlt: "realtime-png-image",
    },
    {
      id: 2,
      title: "Google Authentication",
      text: "You can easily sign in with Google",
      imgSrc: "img/security.png",
      imgAlt: "security-png-image",
    },
    {
      id: 3,
      title: "Engaging UI",
      text: "Keeps you hooked with the attractive user interface",
      imgSrc: "img/ui.png",
      imgAlt: "ui-png-image",
    },
  ];

  return (
    <>
    <Navbar />
    <div className="features">
      <h2 className="features__heading">Features</h2>
      <div className="cards">
        {features.map((data) => {
          return (
            <Cards
              key={data.id}
              title={data.title}
              img={data.imgSrc}
              text={data.text}
              alt={data.imgAlt}
            />
          );
        })}
      </div>
    </div>
    </>
  );
}

export default Features;
