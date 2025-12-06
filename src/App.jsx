import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useGame } from "./context/useGame";
import HeaderBar from "./components/HeaderBar.jsx";
import InitialScreen from "./components/InitialScreen";
import GameArena from "./components/GameArena";
import { Container } from "react-bootstrap";
import TargetCursor from "./cursor/TargetCursor";
import GameOver from "./components/GameOver.jsx";
import "./App.css";

const App = () => {
  const { gameState } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const [contentComponent, setContentComponent] = useState(<InitialScreen />);

  useEffect(() => {
    setIsLoading(true);

    // Simulate delay to show animation (can adjust 400-1200ms)
    const timer = setTimeout(() => {
      if (gameState === "initial") {
        setContentComponent(<InitialScreen />);
      } else if (gameState === "playing") {
        setContentComponent(<GameArena />);
      } else if (gameState === "IsGameOver") {
        setContentComponent(<GameOver />);
      }

      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [gameState]);

  return (
    <Router>
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />

      {/* Global Header */}
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
