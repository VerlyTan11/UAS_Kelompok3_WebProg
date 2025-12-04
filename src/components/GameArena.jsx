import React from "react";
import { useGame } from "../context/useGame";
import PlayerItems from "./PlayerItems";
import SpecificArea from "./SpesificArea";
import { Button } from "react-bootstrap";
import BurgerMenu from "./BurgerMenu";

// Komponen Kontrol Gerakan Global (On-Screen Arrows)
const MovementControlsGlobal = () => {
  const {
    moveAreaByDirection,
    specificLocation,
    currentArea,
    isGameOver,
    activityState,
  } = useGame();
  const isActivityOngoing = !!activityState.name;
  const isDisabled = isActivityOngoing;

  if (isGameOver) return null;

  return (
    <div
      // HANYA TAMPIL di layar BESAR (md ke atas)
      className="d-none d-md-flex justify-content-center align-items-center bg-light shadow-lg border border-dark rounded-3 p-2"
      style={{
        position: "absolute",
        bottom: "150px",
        right: "25px",
        zIndex: 100,
      }}
    >
      <div className="d-flex flex-column align-items-center">
        {/* UP */}
        <Button
          variant="outline-dark"
          size="sm"
          className="mb-1 cursor-target"
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          onClick={() => moveAreaByDirection("up")}
          disabled={isDisabled}
        >
          <i className="bi bi-caret-up-fill"></i>
        </Button>
        <div className="d-flex">
          {/* LEFT */}
          <Button
            variant="outline-dark"
            size="sm"
            className="me-1 cursor-target"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            onClick={() => moveAreaByDirection("left")}
            disabled={isDisabled}
          >
            <i className="bi bi-caret-left-fill"></i>
          </Button>
          {/* HINT */}
          <span
            style={{
              width: "40px",
              textAlign: "center",
              fontSize: "0.7rem",
              marginTop: "10px",
            }}
          >
            {specificLocation ? specificLocation.split(" ")[0] : currentArea}
          </span>
          {/* RIGHT */}
          <Button
            variant="outline-dark"
            size="sm"
            className="ms-1 cursor-target"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            onClick={() => moveAreaByDirection("right")}
            disabled={isDisabled}
          >
            <i className="bi bi-caret-right-fill"></i>
          </Button>
        </div>
        {/* DOWN */}
        <Button
          variant="outline-dark"
          size="sm"
          className="mt-1 cursor-target"
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          onClick={() => moveAreaByDirection("down")}
          disabled={isDisabled}
        >
          <i className="bi bi-caret-down-fill"></i>
        </Button>
      </div>
    </div>
  );
};

const GameArena = () => {
  const {
    currentArea,
    gameAreas,
    moveArea,
    enterSpecificArea,
    specificLocation,
    activityState,
  } = useGame();

  const areaData = gameAreas[currentArea];

  const arenaStyle = {
    height: "650px",
    maxHeight: "90vh",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    opacity: activityState.name ? 0.8 : 1,
    position: "relative",
  };

  // Jika sudah di area spesifik (e.g., Beach), tampilkan SpecificArea
  if (specificLocation) {
    return (
      <div
        className="d-flex"
        style={{
          ...arenaStyle,
          backgroundImage: `url(/${areaData.bg})`,
        }}
      >
        <SpecificArea />
        <PlayerItems />
        <MovementControlsGlobal />
        <BurgerMenu />
      </div>
    );
  }

  // Tampilan Main Game Arena
  const positions = {
    Home: { top: "5%", left: "10%" },
    Beach: { top: "15%", left: "60%" },
    Temple: { top: "35%", left: "32%" },
    Lake: { top: "50%", left: "5%" },
    Mountain: { top: "55%", left: "70%" },
  };

  const getAreaStyle = (areaName) => ({
    ...positions[areaName],
    position: "absolute",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border: areaName === currentArea ? "3px solid blue" : "1px solid black",
    backgroundColor: areaName === currentArea ? "#d9e7ff" : "#eee",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    fontWeight: areaName === currentArea ? "bold" : "normal",
    transition: "opacity 0.3s",
    // HAPUS BAGIAN MEDIA QUERY YANG ERROR DI SINI
  });

  // Handle klik area
  const handleAreaClick = (areaName) => {
    // Jika ada aktivitas yang berjalan, jangan lakukan apa-apa
    if (activityState.name) return;

    if (areaName === currentArea) {
      // Jika area saat ini diklik, masuk ke specific area jika ada
      if (gameAreas[areaName].specificArea) {
        enterSpecificArea(areaName);
      }
      return;
    }

    // Klik di area lain di peta diizinkan untuk kemudahan navigasi
    moveArea(areaName);
  };

  const mainArenaBackground = areaData.bg || "home.jpg";
  const isActivityOngoing = !!activityState.name;

  return (
    <div
      className="d-flex"
      style={{
        ...arenaStyle,
        backgroundImage: `url(/${mainArenaBackground})`,
      }}
    >
      {/* Arena Kiri - Kontainer Peta, sekarang hanya berisi Overlay Peta dan Elemen */}
      <div
        className="flex-grow-1 position-relative"
        style={{ height: "100%", backgroundColor: "rgba(255, 255, 255, 0.7)" }} // Overlay Peta
      >
        {/* Pesan Aktivitas Jika Sedang Berlangsung */}
        {isActivityOngoing && (
          <div
            className="text-center position-absolute w-100"
            style={{ top: "50%", transform: "translateY(-50%)", zIndex: 100 }}
          >
            <h1
              style={{
                color: "#333",
                background: "rgba(255,255,255,0.8)",
                padding: "10px",
              }}
            >
              Aktivitas Sedang Berlangsung!
            </h1>
          </div>
        )}

        {/* Area Lingkaran */}
        {Object.keys(gameAreas).map((areaName) => (
          <div
            key={areaName}
            style={getAreaStyle(areaName)}
            onClick={() => handleAreaClick(areaName)}
            className="shadow-lg cursor-target"
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

            {/* Indikator Area Spesifik */}
            {gameAreas[areaName].specificArea && areaName === currentArea && (
              <small
                style={{
                  position: "absolute",
                  bottom: "-15px",
                  fontSize: "0.8rem",
                }}
              >
                (Click / Enter Specific Area)
              </small>
            )}
          </div>
        ))}
      </div>

      {/* Item Sidebar Kanan (Hanya tampil di Desktop) */}
      <PlayerItems />

      {/* Tombol Panah Global (Hanya tampil di Desktop) */}
      <MovementControlsGlobal />

      {/* Burger Menu (Tampil di Mobile) */}
      <BurgerMenu />
    </div>
  );
};

export default GameArena;
