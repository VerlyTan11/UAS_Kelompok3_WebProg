import React, { useMemo } from "react";
import { useGame } from "../context/useGame";

const GameOver = () => {
  const { playerStats, calculateFinalScore } = useGame();

  // Calculate final score when game over screen mounts
  const finalScore = useMemo(
    () => calculateFinalScore(),
    [calculateFinalScore]
  );

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
      <p>
        Your journey has ended because: <strong>{reason}</strong>
      </p>

      <hr />

      <h2>Life Satisfaction Score</h2>
      <div
        style={{
          fontSize: "3rem",
          color:
            finalScore >= 80 ? "green" : finalScore >= 50 ? "orange" : "red",
        }}
      >
        <strong>{finalScore} / 100</strong>
      </div>
      <p className="mt-2">
        This score reflects your stats balance, activities performed, items
        collected, and areas visited.
      </p>

      <button
        className="btn btn-primary mt-3 cursor-target"
        onClick={() => window.location.reload()}
      >
        Restart Game
      </button>
    </div>
  );
};

export default GameOver;
