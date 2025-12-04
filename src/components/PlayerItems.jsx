import React, { useEffect } from "react";
import { useGame } from "../context/useGame";
import PlayerItemsContent from "./PlayerItemsContent";
// Import konstanta yang dibutuhkan untuk analisis hint
import {
  activityDefinitions,
  gameSpecificAreas,
} from "../context/GameConstants";

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

  // --- Fungsi untuk mendapatkan Hint Area Spesifik ---
  const getSpecificAreaStatHint = () => {
    // 1. Cek apakah sedang berada di lokasi spesifik dan bukan di Exit
    if (!specificLocation || specificLocation.includes("Exit")) {
      return null;
    }

    const specificAreaKey = `${currentArea}Area`;
    const locationData =
      gameSpecificAreas[specificAreaKey]?.locations[specificLocation];

    if (
      !locationData ||
      !locationData.activities ||
      locationData.activities.length === 0
    ) {
      return null;
    }

    const allPositiveStats = {};
    const maxDisplayedStats = 4;

    // 2. Kumpulkan semua stat positif dari SEMUA aktivitas di lokasi ini
    locationData.activities.forEach((activityName) => {
      const activityKey = `${specificLocation} - ${activityName}`;
      const definition = activityDefinitions[activityKey];

      if (definition && definition.statChanges) {
        Object.entries(definition.statChanges).forEach(([stat, change]) => {
          // Kecualikan 'money' DAN 'lifeSatisfaction'
          if (stat !== "money" && stat !== "lifeSatisfaction" && change > 0) {
            allPositiveStats[stat] = true;
          }
        });
      }
    });

    // 3. Format daftar stat
    const statsList = Object.keys(allPositiveStats)
      .map((stat) => {
        // Gunakan emoji yang relevan untuk Meal, Sleep, Happiness, Cleanliness
        if (stat === "meal") return "🍴 Meal";
        if (stat === "sleep") return "🛏️ Sleep";
        if (stat === "happiness") return "😊 Happiness";
        if (stat === "cleanliness") return "🫧 Cleanliness";
        return stat.charAt(0).toUpperCase() + stat.slice(1);
      })
      .slice(0, maxDisplayedStats) // Batasi jumlah yang ditampilkan
      .join(", ");

    let hintText = "";
    if (statsList.length > 0) {
      hintText = `Boosts: ${statsList}`;
    } else {
      // Fallback jika tidak ada stat yang naik
      hintText = `Focus: Unique Actions`;
    }

    // 4. Tampilkan Hint (Menggunakan format yang sama dengan hint Enter)
    return (
      <div className="text-center p-2 border-top border-dark bg-light">
        <small className="text-dark">{hintText}</small>
      </div>
    );
  };
  // --- Akhir Fungsi Hint ---

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
      style={{ maxWidth: "200px" }}
    >
      <div className="p-2 border-bottom border-dark text-center">
        <h5>Player's Items</h5>
      </div>

      {/* Item List Content - DIBUNGKUS DENGAN FLEX-GROW-1 */}
      <div className="flex-grow-1 overflow-auto">
        <PlayerItemsContent />
      </div>

      {/* --- HINT AREA (di bagian bawah sidebar) --- */}

      {/* Logika kondisional yang saling eksklusif: */}

      {/* 1. Jika di Specific Location & tidak ada aktivitas, tampilkan Stat Hint (Prioritas 1) */}
      {!isActivityOngoing &&
      specificLocation &&
      !specificLocation.includes("Exit")
        ? getSpecificAreaStatHint()
        : /* 2. Jika di Main Area & bisa masuk Specific Area, tampilkan Enter Hint (Prioritas 2) */
          gameAreas[currentArea]?.specificArea &&
          !specificLocation &&
          !isActivityOngoing && (
            <div className="text-center p-2 border-top border-dark bg-light">
              <small className="text-dark">
                Press [Enter] to interact with {currentArea}
              </small>
            </div>
          )}

      {/* --- END HINT AREA --- */}
    </div>
  );
};

export default PlayerItems;
