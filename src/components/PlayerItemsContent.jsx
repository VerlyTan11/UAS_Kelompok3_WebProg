// src/components/PlayerItemsContent.jsx
import React from "react";
import { useGame } from "../context/useGame";
import { ListGroup, Button } from "react-bootstrap";

const PlayerItemsContent = () => {
  const { playerItems, activateItem, activityState } = useGame();
  const isActivityOngoing = !!activityState.name;

  return (
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
  );
};

export default PlayerItemsContent;
