import React from "react";
import { useGame } from "../context/useGame";
import PlayerItems from "./PlayerItems";
import SpecificArea from "./SpesificArea";
import BurgerMenu from "./BurgerMenu";

/* ===================== */
/* GLOBAL MOVEMENT ARROW */
/* ===================== */
const MovementControlsGlobal = () => {
  const {
    moveAreaByDirection,
    specificLocation,
    currentArea,
    isGameOver,
    activityState,
  } = useGame();

  if (isGameOver) return null;

  const isDisabled = !!activityState.name;

  const arrowButtonStyle = {
    background: "transparent",
    border: "none",
    width: "48px",
    height: "48px",
  };

  const arrowIconStyle = (rotation) => ({
    width: "100%",
    height: "100%",
    transform: `rotate(${rotation}deg)`,
    filter: isDisabled ? "grayscale(100%) opacity(0.4)" : "none",
  });

  return (
    <div
      className="d-none d-md-flex justify-content-center align-items-center"
      style={{
        position: "absolute",
        bottom: "150px",
        right: "15px",
        zIndex: 100,
      }}
    >
      <div className="d-flex flex-column align-items-center">
        <button
          style={arrowButtonStyle}
          onClick={() => moveAreaByDirection("up")}
          disabled={isDisabled}
        >
          <img src="/right-arrow.png" style={arrowIconStyle(-90)} />
        </button>

        <div className="d-flex">
          <button
            style={arrowButtonStyle}
            onClick={() => moveAreaByDirection("left")}
            disabled={isDisabled}
          >
            <img src="/right-arrow.png" style={arrowIconStyle(180)} />
          </button>

          <div
            className="bg-light rounded shadow-sm d-flex align-items-center justify-content-center mx-1"
            style={{ width: 48, height: 48, fontSize: "0.7rem" }}
          >
            {specificLocation || currentArea}
          </div>

          <button
            style={arrowButtonStyle}
            onClick={() => moveAreaByDirection("right")}
            disabled={isDisabled}
          >
            <img src="/right-arrow.png" style={arrowIconStyle(0)} />
          </button>
        </div>

        <button
          style={arrowButtonStyle}
          onClick={() => moveAreaByDirection("down")}
          disabled={isDisabled}
        >
          <img src="/right-arrow.png" style={arrowIconStyle(90)} />
        </button>
      </div>
    </div>
  );
};

/* ===================== */
/* GAME ARENA */
/* ===================== */
const GameArena = () => {
  const {
    currentArea,
    gameAreas,
    moveArea,
    enterSpecificArea,
    specificLocation,
    activityState,
    selectedAvatar,
  } = useGame();

  const areaData = gameAreas[currentArea];
  const isMobile = window.innerWidth < 768;
  const avatarSize = isMobile ? "36px" : "50px";

  const arenaStyle = {
    height: "650px",
    maxHeight: "90vh",
    width: "100%",
    maxWidth: "1200px",
    margin: isMobile ? "0 auto" : "0 auto 0 150px",
    backgroundImage: `url(/${areaData.bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    opacity: activityState.name ? 0.8 : 1,
  };

  /* ===================== */
  /* SPECIFIC AREA VIEW */
  /* ===================== */
  if (specificLocation) {
    return (
      <div className="d-flex" style={arenaStyle}>
        <SpecificArea />
        <PlayerItems />
        <MovementControlsGlobal />
        <BurgerMenu />
      </div>
    );
  }

  /* ===================== */
  /* POSISI IKON AREA */
  /* ===================== */
  const positions = {
    Castle: {
      top: "20%",
      left: isMobile ? "30%" : "10%",
    },
    Cave: {
      top: "55%",
      left: isMobile ? "20%" : "5%",
    },
    Mercusuar: {
      top: "15%",
      left: isMobile ? "65%" : "55%",
    },
    Island: {
      top: "65%",
      left: isMobile ? "75%" : "45%",
    },
  };

  /* ===================== */
  /* HANDLE KLIK AREA */
  /* ===================== */
  const handleAreaClick = (areaName) => {
    if (activityState.name) return;

    if (areaName === currentArea) {
      if (gameAreas[areaName].specificArea) {
        enterSpecificArea(areaName);
      }
      return;
    }

    moveArea(areaName);
  };

  return (
    <div className="d-flex" style={arenaStyle}>
      {/* MAP OVERLAY */}
      <div className="flex-grow-1 position-relative">
        {Object.keys(gameAreas).map((areaName) => {
          const area = gameAreas[areaName];
          const isActive = areaName === currentArea;

          return (
            <div
              key={areaName}
              className=" cursor-target game-arena"
              onClick={() => handleAreaClick(areaName)}
              style={{
                position: "absolute",
                ...positions[areaName],
                cursor: "pointer",
                transform: "translate(-50%, -50%)",
                zIndex: isActive ? 20 : 10,
                textAlign: "center",
              }}
            >
              {/* ICON AREA */}
              <img
                src={`/${area.icon}`}
                alt={areaName}
                style={{
                  width: isMobile ? "60px" : "80px",
                  height: "auto",
                  border: isActive ? "3px solid gold" : "2px solid #333",
                  borderRadius: "12px",
                  background: "#fff",
                  padding: "6px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
              />

              {/* AREA NAME */}
              <div
                className="mt-1"
                style={{
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: "0.75rem",
                  color: "#000",
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "6px",
                  padding: "2px 6px",
                }}
              >
                {areaName}
              </div>

              {/* PLAYER AVATAR */}
              {isActive && selectedAvatar && (
                <img
                  src={selectedAvatar}
                  alt="Player"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: "50%",
                    border: "3px solid #000",
                    background: "#fff",
                    objectFit: "cover",
                    zIndex: 99,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <PlayerItems />
      <MovementControlsGlobal />
      <BurgerMenu />
    </div>
  );
};

export default GameArena;
