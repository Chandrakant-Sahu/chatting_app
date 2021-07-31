import React from "react";
import "./Cards.css";

function Cards(props) {
  return (
      <div className="card">
        <div className="card__img">
          <img src={props.img} alt={props.alt} />
        </div>
        <div className="card__info">
          <h5 className="card__title">{props.title}</h5>
          <p className="card__text">{props.text}</p>
        </div>
      </div>
  );
}

export default Cards;
