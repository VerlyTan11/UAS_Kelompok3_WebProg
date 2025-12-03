import React, { useState, useEffect, useCallback } from "react";
import { GameContext } from "./GameContext_Declarations";
import { Modal, Button } from "react-bootstrap";

import {
  initialStats,
  initialItems,
  gameAreas,
  gameSpecificAreas,
  activityDefinitions,
  getNextArea,
  scoreMultipliers,
} from "./GameConstants";

const FAST_FORWARD_FEE = 10000; // Cost to instantly complete an activity
const TIME_PER_TICK_MS = 60 * 1000; // 1 hour game time jump
const REAL_TIME_TICK_MS = 3000; // 3 seconds real time for game logic tick

const getInitialTime = () => new Date(2025, 10, 29, 9, 45); // Helper function for initial date

export const GameProvider = ({ children }) => {
  // Game States
  const [gameState, setGameState] = useState("initial");
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [playerItems, setPlayerItems] = useState(initialItems);
  const [currentArea, setCurrentArea] = useState("Home");
  const [specificLocation, setSpecificLocation] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [worldAreas, setWorldAreas] = useState(gameSpecificAreas);
  const [modalMessage, setModalMessage] = useState(null);

  // Time States
  const [currentTime, setCurrentTime] = useState(getInitialTime());

  // New States for Activities, Modes, and Scoring
  const [activityState, setActivityState] = useState({
    name: null,
    progress: 0,
    totalTicks: 0,
    currentTick: 0,
    statChanges: {},
    message: null,
    animation: null,
    mode: "normal",
    type: "activity",
  });
  const [visitedAreas, setVisitedAreas] = useState(new Set(["Home"]));
  const [activitiesPerformed, setActivitiesPerformed] = useState(0);

  // --- Utility Functions ---

  const updateStats = (statChanges) => {
    setPlayerStats((prev) => {
      const updated = { ...prev };
      for (const stat in statChanges) {
        if (stat === "money") {
          updated.money = Math.max(0, prev.money + statChanges.money);
        } else if (stat === "lifeSatisfaction") {
          updated.lifeSatisfaction = Math.min(
            100,
            Math.max(0, prev.lifeSatisfaction + statChanges.lifeSatisfaction)
          );
        } else {
          // Cap all other stats between 0 and 100
          updated[stat] = Math.min(
            100,
            Math.max(0, prev[stat] + statChanges[stat])
          );
        }
      }
      return updated;
    });
  };

  const calculateFinalScore = useCallback(() => {
    const stats = [
      playerStats.meal,
      playerStats.sleep,
      playerStats.happiness,
      playerStats.cleanliness,
    ];
    const balanceScore = stats.reduce((acc, val) => {
      const penalty = Math.abs(val - 50);
      return acc + (50 - penalty);
    }, 0);
    const normalizedBalanceScore = (balanceScore / 200) * 100;

    const activityScore = Math.min(100, activitiesPerformed * 5);

    const initialUniqueItems = initialItems.length;
    const currentUniqueItems = playerItems.filter(
      (item) => item.inInventory
    ).length;
    const totalPossibleUniqueItems = initialUniqueItems + 3;
    const itemsScore = (currentUniqueItems / totalPossibleUniqueItems) * 100;

    const areaScore = (visitedAreas.size / Object.keys(gameAreas).length) * 100;

    const finalLifeSatisfactionScore = Math.round(
      normalizedBalanceScore * scoreMultipliers.statBalanceWeight +
        activityScore * scoreMultipliers.activitiesPerformedWeight +
        itemsScore * scoreMultipliers.itemsCollectedWeight +
        areaScore * scoreMultipliers.areasVisitedWeight
    );

    return Math.min(100, Math.max(0, finalLifeSatisfactionScore));
  }, [playerStats, activitiesPerformed, playerItems, visitedAreas]);

  const startGame = (name) => {
    setPlayerName(name);
    setGameState("playing");
  };

  const moveArea = (areaName) => {
    if (areaName === null) return;
    setCurrentArea(areaName);
    setSpecificLocation(null);
    setVisitedAreas((prev) => new Set(prev).add(areaName));
  };

  // FIX: Unified directional movement handler
  const moveAreaByDirection = (direction) => {
    const isActivityOngoing = !!activityState.name;
    if (isActivityOngoing) return;

    // 1. Specific Area movement
    if (specificLocation) {
      const specificAreaKey = `${currentArea}Area`;
      const currentLocationData =
        worldAreas[specificAreaKey]?.locations[specificLocation];

      if (currentLocationData && currentLocationData[direction]) {
        const nextLocation = currentLocationData[direction];

        // Jika tujuan adalah Exit gunakan moveSpecificLocation
        if (nextLocation.includes("Exit")) {
          moveSpecificLocation(nextLocation);
        } else {
          // Pindah ke lokasi spesifik baru
          setSpecificLocation(nextLocation);
        }
        return;
      }
    }

    // 2. Main Area movement
    const nextArea = getNextArea(currentArea, direction);
    if (nextArea) {
      moveArea(nextArea);
    }
  };

  const enterSpecificArea = (areaName) => {
    if (gameAreas[areaName].specificArea) {
      const specificAreaKey = `${areaName}Area`;
      const firstLocation = Object.keys(
        worldAreas[specificAreaKey].locations
      )[0];
      setSpecificLocation(firstLocation);
    }
  };

  const moveSpecificLocation = (locationName) => {
    // FIX: Saat Exit dipanggil melalui klik/keyboard, kembali ke Main Area
    if (locationName.includes("Exit")) {
      moveArea(currentArea);
      setSpecificLocation(null);
    } else {
      setSpecificLocation(locationName);
    }
  };

  const completeActivity = useCallback(
    (activityKey, statChanges, initialMoneyChange) => {
      const definition = activityDefinitions[activityKey];

      const finalStatChanges = { ...statChanges };
      if (initialMoneyChange !== undefined) {
        finalStatChanges.money = initialMoneyChange;
      }

      updateStats(finalStatChanges);
      setActivitiesPerformed((prev) => prev + 1);

      if (definition.type === "purchase" && definition.itemAcquired) {
        const acquiredItem = definition.itemAcquired;
        setPlayerItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.id === acquiredItem.id
          );
          if (!existingItem) {
            return [...prevItems, { ...acquiredItem, inInventory: true }];
          }
          return prevItems.map((item) =>
            item.id === acquiredItem.id ? { ...item, inInventory: true } : item
          );
        });
      }

      setActivityState({
        name: null,
        progress: 0,
        totalTicks: 0,
        currentTick: 0,
        statChanges: {},
        message: null,
        animation: null,
        mode: "normal",
        type: "activity",
      });
    },
    []
  );

  const startActivity = (activityKey, mode = "normal") => {
    if (activityState.name) return;
    const definition = activityDefinitions[activityKey];

    const hasRequiredItems = definition.requiredItems.every((itemReq) =>
      playerItems.some((item) => item.id === itemReq && item.inInventory)
    );
    if (!hasRequiredItems) {
      alert(
        `You need ${definition.requiredItems.join(
          ", "
        )} to perform this activity!`
      );
      return;
    }

    let baseMoneyChange = definition.statChanges.money || 0;
    let moneyDeduction = 0;

    if (mode === "fastforward") {
      moneyDeduction = -FAST_FORWARD_FEE;
    }

    const totalMoneyChange = baseMoneyChange + moneyDeduction;

    if (playerStats.money + totalMoneyChange < 0) {
      alert(
        `Not enough money! This action requires ${Math.abs(
          totalMoneyChange
        ).toLocaleString("id-ID")} (Base: ${Math.abs(
          baseMoneyChange
        ).toLocaleString("id-ID")} ${
          mode === "fastforward"
            ? `+ Fast Foward Mode Fee: ${FAST_FORWARD_FEE.toLocaleString(
                "id-ID"
              )}`
            : ""
        })`
      );
      return;
    }

    setActivityState({
      name: activityKey,
      progress: 0,
      totalTicks: definition.duration,
      currentTick: 0,
      statChanges: definition.statChanges,
      message: definition.message,
      animation: definition.animation,
      mode: mode,
      type: definition.type || "activity",
    });

    if (mode === "fastforward") {
      const finalStatChanges = {
        ...definition.statChanges,
        money: totalMoneyChange,
      };
      completeActivity(activityKey, finalStatChanges, totalMoneyChange);

      setCurrentTime(
        (prev) =>
          new Date(prev.getTime() + definition.duration * TIME_PER_TICK_MS)
      );
    } else {
      if (baseMoneyChange !== 0) {
        updateStats({ money: baseMoneyChange });
      }
    }
  };

  const fastForwardActivity = () => {
    if (activityState.name && activityState.mode === "normal") {
      const remainingTicks =
        activityState.totalTicks - activityState.currentTick;

      if (playerStats.money - FAST_FORWARD_FEE < 0) {
        alert(
          `Not enough money for Fast Forward Fee: ${FAST_FORWARD_FEE.toLocaleString(
            "id-ID"
          )}!`
        );
        return;
      }

      const timeToAdvance = remainingTicks * TIME_PER_TICK_MS;
      setCurrentTime((prev) => new Date(prev.getTime() + timeToAdvance));

      updateStats({ money: -FAST_FORWARD_FEE });

      setActivitiesPerformed((prev) => prev + 1);
      setActivityState({
        name: null,
        progress: 0,
        totalTicks: 0,
        currentTick: 0,
        statChanges: {},
        message: null,
        animation: null,
        mode: "normal",
        type: "activity",
      });
    }
  };

  const collectItem = (itemId) => {
    setPlayerItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inInventory: true } : item
      )
    );

    // remove item from world (Specific Area)
    setWorldAreas((prev) => {
      const updated = { ...prev };
      const area = updated[`${currentArea}Area`];

      if (!area) return prev;

      const loc = area.locations[specificLocation];
      if (!loc?.items) return prev;

      loc.items = loc.items.filter((i) => i !== itemId);

      return updated;
    });
  };

  const activateItem = (itemId) => {
    const item = playerItems.find((i) => i.id === itemId);

    if (!item || !item.usable || !item.inInventory) return;

    // Rule: area restriction
    if (item.onlyUsableIn && item.onlyUsableIn !== currentArea) {
      setModalMessage(`${item.name} can only be used in ${item.onlyUsableIn}!`);
      return;
    }

    // Apply stat effect
    updateStats(item.effect);

    if (item.type === "consumable") {
      setPlayerItems((prevItems) =>
        prevItems.map((i) =>
          i.id === itemId ? { ...i, inInventory: false } : i
        )
      );
      setModalMessage(`${item.name} has been consumed!`);
    }

    if (item.type === "tool") {
      setModalMessage(`${item.name} used successfully!`);
    }
  };

  // --- Interval Ticks ---

  useEffect(() => {
    if (gameState !== "playing" || isGameOver) return;

    const tickInterval = setInterval(() => {
      setActivityState((prevActivity) => {
        if (prevActivity.name && prevActivity.mode === "normal") {
          const nextTick = prevActivity.currentTick + 1;
          const newProgress = Math.min(
            100,
            (nextTick / prevActivity.totalTicks) * 100
          );

          const definition = activityDefinitions[prevActivity.name];
          const partialStatChanges = {};
          for (const stat in definition.statChanges) {
            if (stat === "money") continue;

            partialStatChanges[stat] =
              definition.statChanges[stat] / prevActivity.totalTicks;
          }
          updateStats(partialStatChanges);

          if (nextTick >= prevActivity.totalTicks) {
            setActivitiesPerformed((prev) => prev + 1);

            return {
              name: null,
              progress: 0,
              totalTicks: 0,
              currentTick: 0,
              statChanges: {},
              message: null,
              animation: null,
              mode: "normal",
              type: "activity",
            };
          } else {
            return {
              ...prevActivity,
              currentTick: nextTick,
              progress: newProgress,
            };
          }
        }
        return prevActivity;
      });

      // 2. Stat Decay
      setPlayerStats((prev) => {
        const updated = {
          ...prev,
          // Decay Rate: -5 per tick (1 hour game time)
          meal: Math.max(0, prev.meal - 0.5),
          sleep: Math.max(0, prev.sleep - 0.5),
          happiness: Math.max(0, prev.happiness - 0.5),
          cleanliness: Math.max(0, prev.cleanliness - 0.5),
        };

        // 3. Check Game Over
        if (
          updated.meal === 0 ||
          updated.sleep === 0 ||
          updated.happiness === 0 ||
          updated.cleanliness === 0
        ) {
          setIsGameOver(true);
          setGameState("IsGameOver");
        }
        return updated;
      });

      // 4. Advance Game Time (1 hour)
      setCurrentTime((prev) => new Date(prev.getTime() + TIME_PER_TICK_MS));
    }, REAL_TIME_TICK_MS); // 5 seconds for game logic

    return () => clearInterval(tickInterval);
  }, [gameState, isGameOver]);

  // --- Value Provider ---
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
        activityState,
        visitedAreas,
        activitiesPerformed,
        startGame,
        moveArea,
        moveAreaByDirection,
        enterSpecificArea,
        moveSpecificLocation,
        startActivity,
        fastForwardActivity,
        activateItem,
        isGameOver,
        setIsGameOver,
        calculateFinalScore,
        FAST_FORWARD_FEE,
        collectItem,
        worldAreas,
      }}
    >
      {children}

      <Modal
        show={!!modalMessage}
        onHide={() => setModalMessage(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p style={{ fontSize: "1.2rem" }}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="w-100"
            onClick={() => setModalMessage(null)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </GameContext.Provider>
  );
};
