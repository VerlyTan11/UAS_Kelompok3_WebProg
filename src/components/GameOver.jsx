import React from "react";
import { useGame } from "../context/useGame";

const GameOver = () => {
  const { playerStats } = useGame();

  const reason =
    playerStats.meal === 0
      ? "You ran out of food!"
      : playerStats.sleep === 0
      ? "You collapsed from exhaustion!"
      : playerStats.happiness === 0
      ? "You lost all happiness!"
      : playerStats.cleanliness === 0
      ? "You became too dirty!"
      : "Unknown reason";

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        border: "3px solid black",
        background: "white",
        maxWidth: "600px",
        margin: "40px auto",
      }}
    >
      <h1>GAME OVER</h1>
      <p>{reason}</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => window.location.reload()}
      >
        Restart Game
      </button>
    </div>
  );
};

export default GameOver;
