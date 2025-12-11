import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Container } from "react-bootstrap";

import { useGame } from "./context/useGame";
import HeaderBar from "./components/HeaderBar.jsx";
import InitialScreen from "./components/InitialScreen";
import GameArena from "./components/GameArena";
import GameOver from "./components/GameOver.jsx";
import TargetCursor from "./cursor/TargetCursor";
import useGameAudio from "./hooks/useGameAudio";
import DeveloperBadge from "./components/DeveloperBadge.jsx";

import "./App.css";

const AppContent = () => {
  const { gameState, isGameOver } = useGame();
  const [isLoading, setIsLoading] = useState(false);

  // Hooks Router
  const navigate = useNavigate();
  const location = useLocation();

  // State yang mencerminkan path tujuan yang diinginkan
  const targetPath = isGameOver
    ? "/gameover"
    : gameState === "playing"
    ? "/game"
    : "/";

  const needsNavigation = targetPath !== location.pathname;

  // Audio system
  const { playClick } = useGameAudio(gameState);

  // EFFECT 1: SFX Click Global
  useEffect(() => {
    const handleClick = () => {
      if (gameState !== "initial") {
        playClick();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [gameState, playClick]);

  // EFFECT 2: Transisi State ke Route Path dengan Loading
  useEffect(() => {
    if (!needsNavigation) return;

    // Mencegah loading di render pertama
    if (location.pathname === "/") {
      navigate(targetPath, { replace: true });
      return;
    }

    // Aktifkan Loading dalam setTimeout untuk menghindari synchronous state update
    const loadingTimer = setTimeout(() => {
      setIsLoading(true);
    }, 0);

    const timer = setTimeout(() => {
      navigate(targetPath);
      setIsLoading(false);
    }, 700);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [gameState, isGameOver, navigate, targetPath, needsNavigation]);

  return (
    <>
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn />

      <HeaderBar />

      <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
        <div className="py-4">
          <Routes>
            <Route path="/" element={<InitialScreen />} />
            <Route path="/game" element={<GameArena />} />
            <Route path="/gameover" element={<GameOver />} />
            <Route path="*" element={<InitialScreen />} />
          </Routes>
        </div>
      </Container>

      <DeveloperBadge />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
