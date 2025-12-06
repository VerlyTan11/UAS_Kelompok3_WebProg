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
      className="border border-dark mb-3 mx-auto w-100 overflow-hidden"
      style={{ maxWidth: "1000px", backgroundColor: "#fff" }}
    >
      {/* ---------- TOP BAR ---------- */}
      <div className="d-flex justify-content-between align-items-center py-2 px-2 border-bottom flex-wrap">
        <div className="text-truncate me-2 fs-6">
          {getGreeting()} <strong>{playerName}</strong>
        </div>

        <div className="mx-1 fs-6 flex-shrink-0">
          <strong>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </div>

        <div className="d-flex align-items-center flex-shrink-0 ms-2 fs-6">
          <span className="me-2">💰</span>
          <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
        </div>
      </div>

      {/* ---------- STATS + SLIDERS ---------- */}
      <div className="px-2 py-2 border-bottom">
        <div className="row g-2 align-items-center">
          {/* Stats Bar (Col-9 on Desktop, Full on Mobile) */}
          <div className="col-12 col-md-9">
            <div className="row g-2">
              {[
                { icon: "🍴", val: playerStats.meal },
                { icon: "🛏️", val: playerStats.sleep },
                { icon: "😊", val: playerStats.happiness },
                { icon: "🫧", val: playerStats.cleanliness },
              ].map((item, i) => (
                <div key={i} className="col-6 col-md-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">{item.icon}</span>
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

          {/* ---- Desktop Sliders (same row with stats) ---- */}
          <div className="d-none d-md-flex col-md-3 flex-column">
            <div>
              <small>🎵 Music</small>
              <Form.Range
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              />
            </div>
            <div className="mt-2">
              <small>🔔 SFX</small>
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

        {/* ---- Mobile Sliders + Burger (below stats) ---- */}
        <div className="d-flex d-md-none align-items-center justify-content-between gap-3 mt-3">
          <div className="flex-grow-1 text-center">
            <small>🎵</small>
            <Form.Range
              min={0}
              max={1}
              step={0.05}
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex-grow-1 text-center">
            <small>🔔</small>
            <Form.Range
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            />
          </div>

          <Button
            className="cursor-target bg-white border-0"
            onClick={() => setIsBurgerMenuOpen(true)}
            style={{ width: 38, height: 38 }}
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
