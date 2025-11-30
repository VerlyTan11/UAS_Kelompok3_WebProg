import React, { useState, useEffect } from "react";
import { GameContext } from "./GameContext_Declarations";

import {
  initialStats,
  initialItems,
  gameAreas,
  beachAreas,
} from "./GameConstants";

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState("initial");
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [playerItems, _setPlayerItems] = useState(initialItems);
  const [currentArea, setCurrentArea] = useState("Home");
  const [specificLocation, setSpecificLocation] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date(2025, 10, 29, 9, 43));

  // ... (Fungsi startGame, moveArea, enterSpecificArea, dll. tetap sama) ...
  const startGame = (name) => {
    setPlayerName(name);
    setGameState("playing");
  };
  const moveArea = (areaName) => {
    setCurrentArea(areaName);
    setSpecificLocation(null);
  };
  const enterSpecificArea = (areaName) => {
    setCurrentArea(areaName);
    setSpecificLocation("Sands Area");
  };
  const moveSpecificLocation = (locationName) => {
    setSpecificLocation(locationName);
  };

  const performActivity = (activity) => {
    alert(`Performing activity: ${activity}`);
    setPlayerStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      cleanliness: Math.max(0, prev.cleanliness - 5),
    }));
    setCurrentTime((prev) => new Date(prev.getTime() + 60 * 60 * 1000));
  };

  useEffect(() => {
    if (gameState !== "playing" || isGameOver) return;

    const statInterval = setInterval(() => {
      setPlayerStats((prev) => {
        const updated = {
          ...prev,
          meal: Math.max(0, prev.meal - 5),
          sleep: Math.max(0, prev.sleep - 5),
          happiness: Math.max(0, prev.happiness - 5),
          cleanliness: Math.max(0, prev.cleanliness - 5),
        };

        // Jika ada stat bernilai 0 → GAME OVER
        if (
          updated.meal === 0 ||
          updated.sleep === 0 ||
          updated.happiness === 0 ||
          updated.cleanliness === 0
        ) {
          setIsGameOver(true);
          setGameState("IsGameOver"); // ⬅ WAJIB AGAR APP.JSX BISA RENDER GAMEOVER
        }

        return updated;
      });
    }, 5000);

    return () => clearInterval(statInterval);
  }, [gameState, isGameOver]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        playerName,
        playerStats,
        currentTime,
        playerItems,
        currentArea,
        specificLocation,
        gameAreas,
        beachAreas,
        startGame,
        moveArea,
        enterSpecificArea,
        moveSpecificLocation,
        performActivity,
        isGameOver,
        setIsGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
