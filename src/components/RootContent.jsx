import React, { useEffect } from "react";
import { useGameRouter } from "../context/useGameRouter";
import HeaderBar from "./HeaderBar";
import InitialScreen from "./InitialScreen";
import GameArena from "./GameArena";
import GameOver from "./GameOver";
import { Container } from "react-bootstrap";
import TargetCursor from "../cursor/TargetCursor"; // Sesuaikan path

const RootContent = () => {
  const { gameState, isGameOver, navigate } = useGameRouter();

  // Tangani transisi state GameContext ke URL
  useEffect(() => {
    if (gameState === "playing") {
      navigate("/game");
    } else if (gameState === "initial") {
      // Jika initial, pastikan di root path
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    } else if (isGameOver) {
      navigate("/gameover");
    }
  }, [gameState, isGameOver, navigate]);

  let contentComponent;

  if (gameState === "initial") {
    contentComponent = <InitialScreen />;
  } else if (gameState === "playing") {
    contentComponent = <GameArena />;
  } else if (gameState === "IsGameOver") {
    contentComponent = <GameOver />;
  }

  return (
    <>
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />

      <HeaderBar />

      <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
        <div className="py-4">{contentComponent}</div>
      </Container>
    </>
  );
};

export default RootContent;
