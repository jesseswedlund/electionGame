import React from "react";
import Game from "./Game.js";

const Home = (props) => {
  return (
    <div className="container">
      <h2>
        Count the votes, first to 270 wins! But don't the boy who cried fraud
        get you!
      </h2>
      <Game />
    </div>
  );
};

export default Home;
