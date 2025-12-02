import React, { useEffect } from "react";
import { useGame } from "../context/useGame";
import { ListGroup, Button } from "react-bootstrap";

const PlayerItems = () => {
  const {
    playerItems,
    activateItem,
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
      className="border border-dark h-100 d-flex flex-column"
      style={{ width: "200px" }}
    >
      <div className="p-2 border-bottom border-dark text-center">
        <h5>Player's Items</h5>
      </div>
      {/* Item List with Use Button */}
      <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
        {playerItems
          .filter((item) => item.inInventory)
          .map((item, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center py-1 px-2 border-0"
              style={{ fontSize: "0.8rem" }}
            >
              <div className="d-flex align-items-center">
                <span className="me-2" role="img" aria-label="item-icon">
                  {item.icon}
                </span>
                {item.name}
              </div>
              {item.usable && (
                <Button
                  variant="info"
                  size="sm"
                  className="cursor-target"
                  onClick={() => activateItem(item.id)}
                  disabled={isActivityOngoing} // Disable use button when activity is running
                >
                  Use
                </Button>
              )}
            </ListGroup.Item>
          ))}
        {playerItems.filter((item) => item.inInventory).length === 0 && (
          <ListGroup.Item className="text-center text-muted border-0">
            No items in inventory.
          </ListGroup.Item>
        )}
      </ListGroup>

      {/* Tambahkan hint tombol Enter */}
      {gameAreas[currentArea]?.specificArea &&
        !specificLocation &&
        !isActivityOngoing && (
          <div className="text-center p-2 border-top border-dark">
            <small className="text-dark">
              Press [Enter] to interact with {currentArea}
            </small>
          </div>
        )}
    </div>
  );
};

export default PlayerItems;
