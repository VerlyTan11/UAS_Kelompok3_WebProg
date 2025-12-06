import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";

import { useGame } from "./context/useGame";
import HeaderBar from "./components/HeaderBar.jsx";
import InitialScreen from "./components/InitialScreen";
import GameArena from "./components/GameArena";
import GameOver from "./components/GameOver.jsx";
import TargetCursor from "./cursor/TargetCursor";
import useGameAudio from "./hooks/useGameAudio";

import "./App.css";

const App = () => {
  const { gameState } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const [contentComponent, setContentComponent] = useState(<InitialScreen />);

  // Audio system
  const { playClick } = useGameAudio(gameState);

  useEffect(() => {
    const handleClick = () => {
      playClick();
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []); // ❗ remove playClick from dependency

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      switch (gameState) {
        case "initial":
          setContentComponent(<InitialScreen />);
          break;
        case "playing":
          setContentComponent(<GameArena />);
          break;
        case "IsGameOver":
          setContentComponent(<GameOver />);
          break;
        default:
          setContentComponent(<InitialScreen />);
      }

      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [gameState]);

  return (
    <Router>
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />

      <HeaderBar />

      <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
        <div className="py-4">{contentComponent}</div>
      </Container>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </Router>
  );
};

export default App;
