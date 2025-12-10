import React from "react";
import { useGame } from "../context/useGame";
import { Button, Form } from "react-bootstrap";
import useGameAudio from "../hooks/useGameAudio";

const HeaderBar = () => {
  const {
    playerStats,
    gameState,
    playerName,
    currentTime,
    setIsBurgerMenuOpen,
  } = useGame();

  const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } =
    useGameAudio(gameState);

  if (gameState !== "playing") return null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 20) return "Good Evening";
    return "Good Night";
  };

  const getBarColor = (value) => {
    if (value > 50) return "bg-success";
    if (value > 25) return "bg-warning";
    return "bg-danger";
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div
      // FIX: Hapus position: fixed dan tambahkan mt-3 untuk jarak dari atas
      className="mx-auto w-100 overflow-hidden shadow-lg p-3 mt-3 mb-3"
      style={{
        // HAPUS: position: "fixed", top, left, transform, zIndex
        maxWidth: "1000px",
        backgroundColor: "#fff",
        borderRadius: "15px", // Desain modern tetap
        border: "none",
        // Menggunakan padding bawaan p-3 (15px) dan menyesuaikan width
        width: isMobile ? "95%" : "auto",
      }}
    >
      {/* ---------- TOP BAR (Greeting, Time, Money) ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap border-bottom pb-2">
        {/* Greeting & Name */}
        <div className="text-truncate me-2 fs-6" style={{ maxWidth: "35%" }}>
          {getGreeting()} <strong>{playerName}</strong>
        </div>

        {/* Time */}
        <div className="mx-1 fs-6 flex-shrink-0">
          <strong>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </div>

        {/* Money */}
        <div className="d-flex align-items-center flex-shrink-0 ms-2 fs-6">
          <span className="me-2">💰</span>
          <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
        </div>
      </div>

      {/* ---------- STATS + SLIDERS ---------- */}
      <div className="d-flex flex-wrap justify-content-start align-items-center">
        <div className="row g-2 align-items-center w-100">
          {/* Stats Bar (Col-9 on Desktop, Full Row on Mobile) */}
          <div className="col-12 col-md-9">
            <div className="row g-2">
              {[
                { icon: "🍴", val: playerStats.meal },
                { icon: "🛏️", val: playerStats.sleep },
                { icon: "😊", val: playerStats.happiness },
                { icon: "🫧", val: playerStats.cleanliness },
              ].map((item, i) => (
                // Col-6 di mobile (2 baris), Col-md-3 di desktop (1 baris)
                <div key={i} className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5 flex-shrink-0">{item.icon}</span>
                    <div
                      className="progress flex-grow-1"
                      style={{ height: isMobile ? "6px" : "12px" }}
                    >
                      <div
                        className={`progress-bar ${getBarColor(item.val)}`}
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Desktop Sliders (Col-3) ---- */}
          <div className="d-none d-md-flex col-md-3 flex-column ps-4 border-start">
            <div className="mb-1">
              <small className="d-block">🎵 Music</small>
              <Form.Range
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <small className="d-block">🔔 SFX</small>
              <Form.Range
                min={0}
                max={1}
                step={0.05}
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* ---- Mobile Sliders + Burger (Baris terpisah di bawah) ---- */}
        <div className="d-flex d-md-none align-items-center justify-content-between gap-3 mt-3 w-100">
          {/* Mobile Music Slider */}
          <div className="flex-grow-1 text-center">
            <small className="d-block">🎵 Music</small>
            <Form.Range
              min={0}
              max={1}
              step={0.05}
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
          </div>

          {/* Mobile SFX Slider */}
          <div className="flex-grow-1 text-center">
            <small className="d-block">🔔 SFX</small>
            <Form.Range
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            />
          </div>

          {/* Burger Button */}
          <Button
            className="cursor-target flex-shrink-0"
            variant="light"
            onClick={() => setIsBurgerMenuOpen(true)}
            style={{ width: 38, height: 38, borderRadius: "50%" }}
          >
            <img
              src="/burger-bar.png"
              alt="Menu"
              style={{ width: "100%", height: "100%" }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
