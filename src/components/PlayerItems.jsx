import React, { useEffect } from "react";
import { useGame } from "../context/useGame";
import { ListGroup, Button } from "react-bootstrap";

const PlayerItems = () => {
  // FIX: Mengubah destructuring dari useItem menjadi activateItem
  const { playerItems, moveAreaByDirection, activateItem, specificLocation } =
    useGame();

  // Handle Keyboard Movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Hanya aktifkan pergerakan keyboard jika tidak berada di area spesifik (Main Arena)
      if (specificLocation) return;

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
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveAreaByDirection, specificLocation]);

  return (
    <div
      className="border border-dark h-100 d-flex flex-column"
      style={{ width: "200px" }}
    >
      <div className="p-2 border-bottom border-dark text-center">
        **Player's Items**
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
                  onClick={() => activateItem(item.id)} // FIX: Menggunakan activateItem
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

      {/* Movement Controls (On-Screen Arrows) */}
      <div className="p-2 border-top border-dark d-flex justify-content-center">
        <div className="d-flex flex-column align-items-center">
          <Button
            variant="outline-dark"
            size="sm"
            className="mb-1 cursor-target"
            style={{ borderRadius: "50%" }}
            onClick={() => moveAreaByDirection("up")}
            disabled={!!specificLocation} // Disable if in specific area
          >
            <i className="bi bi-caret-up-fill"></i>
          </Button>
          <div className="d-flex">
            <Button
              variant="outline-dark"
              size="sm"
              className="me-1 cursor-target"
              style={{ borderRadius: "50%" }}
              onClick={() => moveAreaByDirection("left")}
              disabled={!!specificLocation} // Disable if in specific area
            >
              <i className="bi bi-caret-left-fill"></i>
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              className="cursor-target"
              style={{ borderRadius: "50%" }}
              onClick={() => moveAreaByDirection("right")}
              disabled={!!specificLocation} // Disable if in specific area
            >
              <i className="bi bi-caret-right-fill"></i>
            </Button>
          </div>
          <Button
            variant="outline-dark"
            size="sm"
            className="mt-1 cursor-target"
            style={{ borderRadius: "50%" }}
            onClick={() => moveAreaByDirection("down")}
            disabled={!!specificLocation} // Disable if in specific area
          >
            <i className="bi bi-caret-down-fill"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerItems;
