import React, { useState, useEffect, useCallback } from "react";
import { GameContext } from "./GameContext_Declarations";

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

export const GameProvider = ({ children }) => {
  // Game States
  const [gameState, setGameState] = useState("initial");
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState(initialStats);
  const [playerItems, setPlayerItems] = useState(initialItems);
  const [currentArea, setCurrentArea] = useState("Home");
  const [specificLocation, setSpecificLocation] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date(2025, 10, 29, 9, 43));

  // New States for Activities, Modes, and Scoring
  const [activityState, setActivityState] = useState({
    name: null,
    progress: 0, // 0 to 100
    totalTicks: 0,
    currentTick: 0,
    statChanges: {},
    message: null,
    animation: null,
    mode: "normal", // 'normal' or 'fastforward'
    type: "activity", // 'activity' or 'purchase'
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
    // 1. Stat Balance (closer to 50 is better, max 100 per stat * 4 = 200 total)
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

    // 2. Activities Performed (Max 100 if > 20 activities)
    const activityScore = Math.min(100, activitiesPerformed * 5);

    // 3. Items Collected (Max 100)
    const initialUniqueItems = initialItems.length;
    const currentUniqueItems = playerItems.filter(
      (item) => item.inInventory
    ).length;
    const totalPossibleUniqueItems = initialUniqueItems + 3;
    const itemsScore = (currentUniqueItems / totalPossibleUniqueItems) * 100;

    // 4. Variety of Visited Areas (Max 100 if all 5 main areas visited)
    const areaScore = (visitedAreas.size / Object.keys(gameAreas).length) * 100;

    // Weighted Total Score (Max 100)
    const finalLifeSatisfactionScore = Math.round(
      normalizedBalanceScore * scoreMultipliers.statBalanceWeight +
        activityScore * scoreMultipliers.activitiesPerformedWeight +
        itemsScore * scoreMultipliers.itemsCollectedWeight +
        areaScore * scoreMultipliers.areasVisitedWeight
    );

    return Math.min(100, Math.max(0, finalLifeSatisfactionScore));
  }, [playerStats, activitiesPerformed, playerItems, visitedAreas]);

  // --- Game Loop and Core Functions ---

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

  const moveAreaByDirection = (direction) => {
    const nextArea = getNextArea(currentArea, direction);
    if (nextArea) {
      moveArea(nextArea);
    }
  };

  const enterSpecificArea = (areaName) => {
    if (gameAreas[areaName].specificArea) {
      const specificAreaKey = `${areaName}Area`;
      const firstLocation = Object.keys(
        gameSpecificAreas[specificAreaKey].locations
      )[0];
      setSpecificLocation(firstLocation);
    }
  };

  const moveSpecificLocation = (locationName) => {
    if (locationName === "Road (for going back)" || locationName === "Exit") {
      moveArea(currentArea);
      setSpecificLocation(null);
    } else {
      setSpecificLocation(locationName);
    }
  };

  // Activity execution/completion
  const completeActivity = useCallback(
    (activityKey, statChanges, initialMoneyChange) => {
      const definition = activityDefinitions[activityKey];

      // Calculate final stats to apply (excluding money if already applied)
      const finalStatChanges = { ...statChanges };
      if (initialMoneyChange !== undefined) {
        finalStatChanges.money = initialMoneyChange;
      }

      // Apply final stats
      updateStats(finalStatChanges);
      setActivitiesPerformed((prev) => prev + 1);

      // Apply item acquired (if purchase)
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

      // Reset activity state
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

  // Start the activity
  const startActivity = (activityKey, mode = "normal") => {
    if (activityState.name) return;
    const definition = activityDefinitions[activityKey];

    // Check item requirements
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

    // --- Money Logic ---
    let baseMoneyChange = definition.statChanges.money || 0;
    let moneyDeduction = 0;

    if (mode === "fastforward") {
      moneyDeduction = -FAST_FORWARD_FEE;
    }

    const totalMoneyChange = baseMoneyChange + moneyDeduction;

    // Check overall money requirement
    if (playerStats.money + totalMoneyChange < 0) {
      alert(
        `Not enough money! This action requires ${Math.abs(
          totalMoneyChange
        ).toLocaleString("id-ID")} (Base: ${Math.abs(
          baseMoneyChange
        ).toLocaleString("id-ID")} ${
          mode === "fastforward"
            ? `+ FF Fee: ${FAST_FORWARD_FEE.toLocaleString("id-ID")}`
            : ""
        })`
      );
      return;
    }

    // Set up the activity state (using base stat changes for progress calculation)
    setActivityState({
      name: activityKey,
      progress: 0,
      totalTicks: definition.duration,
      currentTick: 0,
      statChanges: definition.statChanges, // Base stats for incremental application
      message: definition.message,
      animation: definition.animation,
      mode: mode,
      type: definition.type || "activity",
    });

    // --- Immediate Actions ---
    if (mode === "fastforward") {
      // Apply all stats + total money change instantly
      const finalStatChanges = {
        ...definition.statChanges,
        money: totalMoneyChange,
      };

      // Pass the activity key, the non-money stats for completion, and the total money change
      completeActivity(activityKey, finalStatChanges, totalMoneyChange);

      setCurrentTime(
        (prev) =>
          new Date(prev.getTime() + definition.duration * 60 * 60 * 1000)
      );
    } else {
      // Normal Mode: Deduct/Gain initial money instantly, other stats apply over time.
      if (baseMoneyChange !== 0) {
        updateStats({ money: baseMoneyChange });
      }
    }
  };

  // Handler for Fast Forward button (instant completion for Normal mode activity)
  const fastForwardActivity = () => {
    if (activityState.name && activityState.mode === "normal") {
      //const definition = activityDefinitions[activityState.name];
      const remainingTicks =
        activityState.totalTicks - activityState.currentTick;

      // Check if money is sufficient for FF fee
      if (playerStats.money - FAST_FORWARD_FEE < 0) {
        alert(
          `Not enough money for Fast Forward Fee: ${FAST_FORWARD_FEE.toLocaleString(
            "id-ID"
          )}!`
        );
        return;
      }

      // Advance remaining time
      const timeToAdvance = remainingTicks * 60 * 60 * 1000;
      setCurrentTime((prev) => new Date(prev.getTime() + timeToAdvance));

      // Apply FF Fee instantly
      updateStats({ money: -FAST_FORWARD_FEE });

      // Reset state and count as performed
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

  // Use Item (Renamed to activateItem to avoid ESLint Hook rule false positive)
  const activateItem = (itemId) => {
    const item = playerItems.find((i) => i.id === itemId);
    if (!item || !item.usable || !item.inInventory) return;

    // Apply item effects
    updateStats(item.effect);

    // Remove consumable items from inventory
    if (item.type === "consumable") {
      setPlayerItems((prevItems) =>
        prevItems.map((i) =>
          i.id === itemId ? { ...i, inInventory: false } : i
        )
      );
    }
  };

  // --- Interval Ticks ---

  useEffect(() => {
    if (gameState !== "playing" || isGameOver) return;

    // Main Stat Decay/Activity Interval (Runs every 5 seconds)
    const tickInterval = setInterval(() => {
      // 1. Activity Progress (Normal Mode only)
      setActivityState((prevActivity) => {
        if (prevActivity.name && prevActivity.mode === "normal") {
          const nextTick = prevActivity.currentTick + 1;
          const newProgress = Math.min(
            100,
            (nextTick / prevActivity.totalTicks) * 100
          );

          // Calculate and apply partial stat changes per tick (EXCLUDING MONEY, which was applied instantly)
          const definition = activityDefinitions[prevActivity.name];
          const partialStatChanges = {};
          for (const stat in definition.statChanges) {
            // Skip money as it was handled instantly in startActivity
            if (stat === "money") continue;

            partialStatChanges[stat] =
              definition.statChanges[stat] / prevActivity.totalTicks;
          }
          updateStats(partialStatChanges);

          if (nextTick >= prevActivity.totalTicks) {
            // Activity Complete
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
          meal: Math.max(0, prev.meal - 5),
          sleep: Math.max(0, prev.sleep - 5),
          happiness: Math.max(0, prev.happiness - 5),
          cleanliness: Math.max(0, prev.cleanliness - 5),
          lifeSatisfaction: Math.max(0, prev.lifeSatisfaction - 1),
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

      // 4. Advance Time (Always advance by 1 hour)
      setCurrentTime((prev) => new Date(prev.getTime() + 60 * 60 * 1000));
    }, 5000); // 5 seconds per tick for decay and normal mode activity progress

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
        gameSpecificAreas,
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
