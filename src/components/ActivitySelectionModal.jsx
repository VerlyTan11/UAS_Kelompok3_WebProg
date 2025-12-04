// src/components/ActivitySelectionModal.jsx
import React from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { useGame } from "../context/useGame";
import { activityDefinitions } from "../context/GameConstants";

const ActivitySelectionModal = ({
  show,
  handleClose,
  specificLocation,
  currentActivities,
  handleActivityStart,
}) => {
  const { playerItems, playerStats, FAST_FORWARD_FEE } = useGame();

  if (!specificLocation) return null;

  // Cek apakah item yang diperlukan tersedia
  const isActivityAvailable = (activityName) => {
    const activityKey = `${specificLocation} - ${activityName}`;
    const definition = activityDefinitions[activityKey];
    if (!definition || !definition.requiredItems?.length) return true;

    return definition.requiredItems.every((itemReq) =>
      playerItems.some((item) => item.id === itemReq && item.inInventory)
    );
  };

  // Cek apakah ada uang yang cukup untuk biaya dasar aktivitas
  const isBaseCostAffordable = (activityKey) => {
    const definition = activityDefinitions[activityKey];
    const baseMoneyCost = definition?.statChanges?.money || 0;
    return playerStats.money + baseMoneyCost >= 0;
  };

  // Cek apakah ada uang yang cukup untuk Fast Forward (biaya base + biaya FF)
  const isFastForwardAffordable = (activityKey) => {
    const definition = activityDefinitions[activityKey];
    const baseMoneyCost = definition?.statChanges?.money || 0;
    const totalCost = Math.abs(baseMoneyCost) + FAST_FORWARD_FEE;
    return playerStats.money >= totalCost;
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Activities in {specificLocation}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentActivities.map((activityName) => {
          const activityKey = `${specificLocation} - ${activityName}`;
          const isAvailable =
            isActivityAvailable(activityName) &&
            isBaseCostAffordable(activityKey);
          const isFastForwardPossible =
            isAvailable && isFastForwardAffordable(activityKey);

          const definition = activityDefinitions[activityKey] || {};
          const moneyText = definition.statChanges?.money
            ? ` (Cost: 💰${Math.abs(
                definition.statChanges.money
              ).toLocaleString("id-ID")})`
            : "";

          return (
            <Card key={activityName} className="mb-3 p-2 shadow-sm">
              <span className="me-2 fs-5 mb-2" style={{ fontWeight: "bold" }}>
                {activityName} {definition.animation}
                {moneyText}
              </span>
              <div className="d-flex justify-content-between flex-column flex-sm-row">
                <Button
                  variant={isAvailable ? "outline-dark" : "outline-secondary"}
                  className="cursor-target flex-fill me-sm-1 mb-1 mb-sm-0"
                  onClick={() => handleActivityStart(activityName, "normal")}
                  disabled={!isAvailable}
                >
                  Normal Mode
                </Button>
                <Button
                  variant={
                    isFastForwardPossible
                      ? "outline-primary"
                      : "outline-secondary"
                  }
                  className="cursor-target flex-fill"
                  onClick={() =>
                    handleActivityStart(activityName, "fastforward")
                  }
                  disabled={!isFastForwardPossible}
                  title={
                    !isFastForwardPossible
                      ? `Requires total 💰${(
                          Math.abs(definition.statChanges?.money || 0) +
                          FAST_FORWARD_FEE
                        ).toLocaleString("id-ID")}`
                      : ""
                  }
                >
                  Fast Foward Mode (💰
                  {FAST_FORWARD_FEE.toLocaleString("id-ID")})
                </Button>
              </div>
              {!isAvailable && (
                <small className="text-danger mt-1">
                  (
                  {definition.requiredItems?.length > 0
                    ? `Needs: ${definition.requiredItems.join(", ")}`
                    : ""}
                  {!isBaseCostAffordable(activityKey)
                    ? " Not enough money for base cost!"
                    : ""}
                  )
                </small>
              )}
            </Card>
          );
        })}
      </Modal.Body>
    </Modal>
  );
};

export default ActivitySelectionModal;
