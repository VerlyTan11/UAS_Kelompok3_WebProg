import React from "react";
import { useGame } from "../context/useGame";
import PlayerItems from "./PlayerItems";
import SpecificArea from "./SpesificArea";
import { Button } from "react-bootstrap";

const GameArena = () => {
  const {
    currentArea,
    gameAreas,
    moveArea,
    enterSpecificArea,
    specificLocation,
  } = useGame();

  // Jika sudah di area spesifik (e.g., Beach), tampilkan SpecificArea
  if (specificLocation) {
    return (
      <div
        className="d-flex"
        style={{ height: "600px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <SpecificArea />
        <PlayerItems />
      </div>
    );
  }

  // Tampilan Main Game Arena (Figure 2)
  const positions = {
    Home: { top: "5%", left: "10%" },
    Beach: { top: "15%", left: "60%" },
    Temple: { top: "35%", left: "32%" },
    Lake: { top: "55%", left: "5%" },
    Mountain: { top: "55%", left: "70%" },
  };

  const getAreaStyle = (areaName) => ({
    ...positions[areaName],
    position: "absolute",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border: "1px solid black",
    backgroundColor: "#eee",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
  });

  // Handle klik area
  const handleAreaClick = (areaName) => {
    if (currentArea === areaName) return; // Sudah di area ini

    if (gameAreas[areaName].specificArea) {
      enterSpecificArea(areaName);
    } else {
      moveArea(areaName);
    }
  };

  return (
    <div
      className="d-flex"
      style={{ height: "600px", maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* Arena Kiri */}
      <div
        className="flex-grow-1 position-relative border-end border-dark"
        style={{ height: "100%" }}
      >
        {/* Area Lingkaran */}
        {Object.keys(gameAreas).map((areaName) => (
          <div
            key={areaName}
            style={getAreaStyle(areaName)}
            onClick={() => handleAreaClick(areaName)}
            className="shadow-sm cursor-target"
          >
            <span className="text-dark">{areaName}</span>

            {/* Player Icon di lokasi saat ini */}
            {areaName === currentArea && (
              <div
                style={{
                  position: "absolute",
                  top: "-25px",
                  right: "-25px",
                  fontSize: "30px",
                }}
              >
                🧍
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Item Sidebar Kanan */}
      <PlayerItems />
    </div>
  );
};

export default GameArena;
