import React from "react";
import { useGame } from "./context/useGame";
import HeaderBar from "./components/HeaderBar.jsx";
import InitialScreen from "./components/InitialScreen";
import GameArena from "./components/GameArena";
import { Container } from "react-bootstrap";
import TargetCursor from "./cursor/TargetCursor";
import "./App.css";
import GameOver from "./components/GameOver.jsx";

const App = () => {
  const { gameState } = useGame();

  return (
    <Container
      fluid
      className="p-0"
      style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}
    >
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      <HeaderBar />

      <div className="py-4">
        {gameState === "initial" && <InitialScreen />}
        {gameState === "playing" && <GameArena />}
        {gameState === "IsGameOver" && <GameOver />}
      </div>
    </Container>
  );
};

export default App;
