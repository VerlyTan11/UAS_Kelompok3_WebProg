import React, { useEffect } from "react";
import { useGame } from "../context/useGame";
import PlayerItemsContent from "./PlayerItemsContent";

const PlayerItems = () => {
  const {
    specificLocation,
    currentArea,
    activityState,
    gameAreas,
    enterSpecificArea,
    moveAreaByDirection,
  } = useGame();

  const isActivityOngoing = !!activityState.name;

  // Handle Keyboard Movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Jika aktivitas sedang berjalan, abaikan semua input
      if (isActivityOngoing) return;

      // 2. Handle Directional Movement (Main Area DAN Specific Area)
      switch (e.key) {
        case "ArrowUp":
        case "w":
          moveAreaByDirection("up");
          break;
        case "ArrowDown":
        case "s":
          moveAreaByDirection("down");
          break;
        case "ArrowLeft":
        case "a":
          moveAreaByDirection("left");
          break;
        case "ArrowRight":
        case "d":
          moveAreaByDirection("right");
          break;
        case "Enter":
          // Jika di Area Utama dan Area saat ini memiliki Specific Area, MASUK
          if (!specificLocation && gameAreas[currentArea]?.specificArea) {
            enterSpecificArea(currentArea);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    moveAreaByDirection,
    isActivityOngoing,
    gameAreas,
    currentArea,
    specificLocation,
    enterSpecificArea,
  ]);

  return (
    <div
      className="d-none d-md-flex border border-dark h-100 flex-column"
      style={{ maxWidth: "200px" }} // Hapus width: "100%" karena ini hanya sidebar desktop
    >
      <div className="p-2 border-bottom border-dark text-center">
        <h5>Player's Items</h5>
      </div>

      {/* Item List Content */}
      <PlayerItemsContent />

      {/* Tambahkan hint tombol Enter */}
      {gameAreas[currentArea]?.specificArea &&
        !specificLocation &&
        !isActivityOngoing && (
          <div className="text-center p-2 border-top border-dark bg-light">
            <small className="text-dark">
              Press [Enter] to interact with {currentArea}
            </small>
          </div>
        )}
    </div>
  );
};

export default PlayerItems;
