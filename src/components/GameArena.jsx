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

  // Gaya tombol panah yang baru
  const arrowButtonStyle = {
    background: "transparent",
    border: "none",
    padding: "0",
    width: "48px",
    height: "48px",
    cursor: "pointer",
    transition: "transform 0.1s ease",
  };

  // Gambar segitiga hitam
  const arrowIconStyle = (rotation) => ({
    width: "100%",
    height: "100%",
    transform: `rotate(${rotation}deg)`,
    filter: isDisabled ? "grayscale(100%) opacity(0.4)" : "none",
  });

  return (
    <div
      className="d-none d-md-flex justify-content-center align-items-center p-2"
      style={{
        position: "absolute",
        bottom: "150px",
        right: "15px",
        zIndex: 100,
        background: "transparent",
      }}
    >
      <div className="d-flex flex-column align-items-center">
        {/* UP */}
        <button
          style={arrowButtonStyle}
          onClick={() => moveAreaByDirection("up")}
          disabled={isDisabled}
          className="cursor-target mb-1"
        >
          <img
            src="/right-arrow.png"
            alt="up"
            style={arrowIconStyle(-90)} // Rotate 90° ke kiri
          />
        </button>

        <div className="d-flex align-items-center justify-content-center">
          {/* LEFT */}
          <button
            style={{ ...arrowButtonStyle, marginRight: "6px" }}
            onClick={() => moveAreaByDirection("left")}
            disabled={isDisabled}
            className="cursor-target"
          >
            <img
              src="/right-arrow.png"
              alt="left"
              style={arrowIconStyle(180)} // Rotate 180°
            />
          </button>

          {/* HINT */}
          <span
            className="bg-light text-dark shadow-sm rounded d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              fontSize: "0.7rem",
              border: "1px solid #ccc",
            }}
          >
            {specificLocation ? specificLocation.split(" ")[0] : currentArea}
          </span>

          {/* RIGHT */}
          <button
            style={{ ...arrowButtonStyle, marginLeft: "6px" }}
            onClick={() => moveAreaByDirection("right")}
            disabled={isDisabled}
          >
            <img
              src="/right-arrow.png"
              alt="right"
              style={arrowIconStyle(0)} // Normal (ke kanan)
              className="cursor-target"
            />
          </button>
        </div>

        {/* DOWN */}
        <button
          style={{ ...arrowButtonStyle, marginTop: "6px" }}
          onClick={() => moveAreaByDirection("down")}
          disabled={isDisabled}
          className="cursor-target"
        >
          <img
            src="/right-arrow.png"
            alt="down"
            style={arrowIconStyle(90)} // Rotate 90° ke kanan
          />
        </button>
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
    selectedAvatar,
  } = useGame();

  const areaData = gameAreas[currentArea];

  const avatarSize = window.innerWidth < 768 ? "40px" : "60px";

  const arenaStyle = {
    height: "650px",
    maxHeight: "90vh",
    width: "100%",
    maxWidth: "1200px",
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

  const getAreaStyle = (areaName) => {
    const isMobile = window.innerWidth < 768;
    const size = isMobile ? "23vw" : "120px"; // Ukuran sedikit diperkecil untuk mobile
    const fontSize = isMobile ? "0.7rem" : "1rem";

    const dynamicPositions = {
      ...positions[areaName],
      // Penyesuaian posisi spesifik di mobile agar tidak terpotong
      ...(isMobile && {
        Home: { top: "5%", left: "5%" },
        Beach: { top: "15%", left: "55%" },
        Temple: { top: "35%", left: "25%" },
        Lake: { top: "50%", left: "5%" },
        Mountain: { top: "60%", left: "60%" }, // FIX: Ditarik ke kiri dan bawah agar tidak overflow
      }),
    };

    return {
      ...dynamicPositions, // Gunakan posisi yang sudah disesuaikan
      position: "absolute",
      width: size,
      height: size,
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
      fontSize: fontSize,
    };
  };

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

  console.log("Selected Avatar:", selectedAvatar);

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
                {/* Player Avatar Icon */}
                {selectedAvatar && (
                  <img
                    src={selectedAvatar}
                    alt="Player Avatar"
                    style={{
                      position: "absolute",
                      width: avatarSize,
                      height: avatarSize,
                      top: window.innerWidth < 768 ? "20px" : "20px",
                      right: window.innerWidth < 768 ? "5px" : "-10px",
                      borderRadius: "50%",
                      border: "3px solid #000",
                      background: "#fff",
                      objectFit: "cover",
                      boxShadow: "0px 0px 6px rgba(0,0,0,0.4)",
                      zIndex: 999, // 🔥 Pastikan tidak tertutup elemen lain
                    }}
                  />
                )}
              </div>
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
