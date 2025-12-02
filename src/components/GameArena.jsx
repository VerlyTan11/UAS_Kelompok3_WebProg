import React from "react";
import { useGame } from "../context/useGame";
import PlayerItems from "./PlayerItems";
import SpecificArea from "./SpesificArea";

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

  // Jika sudah di area spesifik (e.g., Beach), tampilkan SpecificArea
  if (specificLocation) {
    // SpecificArea akan menangani tampilan dan logika di dalamnya
    return (
      <div
        className="d-flex"
        style={{
          height: "600px",
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundImage: `url(/${areaData.bg})`, // Dynamic background
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          opacity: activityState.name ? 0.8 : 1, // Sedikit buram saat aktivitas berlangsung
        }}
      >
        <SpecificArea />
        <PlayerItems />
      </div>
    );
  }

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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border: areaName === currentArea ? "3px solid blue" : "1px solid black",
    backgroundColor: areaName === currentArea ? "#d9e7ff" : "#eee",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    fontWeight: areaName === currentArea ? "bold" : "normal",
    transition: "opacity 0.3s",
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

    // Pindah ke area lain
    // Pergerakan antar area utama ditangani oleh moveAreaByDirection (Keyboard/Panah)
    // Klik di area lain di peta diizinkan untuk kemudahan navigasi
    moveArea(areaName); // <-- moveArea sekarang terdefinisi
  };

  // Latar belakang untuk Main Arena
  const mainArenaBackground = areaData.bg || "home.jpg";
  const isActivityOngoing = !!activityState.name;

  return (
    <div
      className="d-flex"
      style={{
        height: "600px",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundImage: `url(/${mainArenaBackground})`, // Dynamic background
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        opacity: isActivityOngoing ? 0.8 : 1, // Sedikit buram saat aktivitas berlangsung
      }}
    >
      {/* Arena Kiri */}
      <div
        className="flex-grow-1 position-relative"
        style={{ height: "100%", backgroundColor: "rgba(255, 255, 255, 0.7)" }} // Overlay putih agar lingkaran terlihat
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

      {/* Item Sidebar Kanan */}
      <PlayerItems />
    </div>
  );
};

export default GameArena;
