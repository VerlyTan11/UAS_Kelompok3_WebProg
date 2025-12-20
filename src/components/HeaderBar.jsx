import React from "react";
import { Button, Form } from "react-bootstrap";
import { useGame } from "../context/useGame";
import useGameAudio from "../hooks/useGameAudio";

/* ======================
   UTIL
   ====================== */
const formatTime = (date) =>
  date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

/* ======================
   MOBILE HEADER
   ====================== */
const MobileHeader = ({
  playerName,
  playerStats,
  currentTime,
  activityMode,
  getGreeting,
  getBarColor,
  musicVolume,
  sfxVolume,
  setMusicVolume,
  setSfxVolume,
  setIsBurgerMenuOpen,
}) => (
  <div className="d-md-none mx-auto w-100 shadow p-3 mt-3 mb-3 rounded bg-white">
    {/* TOP INFO */}
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
      <div>
        {getGreeting()} <strong>{playerName}</strong>
      </div>

      <div className="text-center">
        <strong>{formatTime(currentTime)}</strong>
        {activityMode === "fastforward" && (
          <div className="text-warning small">⏩ Fast Forward</div>
        )}
      </div>

      <div>
        💎 <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
      </div>
    </div>

    {/* STATS */}
    <div className="row g-2">
      {[
        { icon: "🍴", val: playerStats.meal },
        { icon: "🛏️", val: playerStats.sleep },
        { icon: "😊", val: playerStats.happiness },
        { icon: "🫧", val: playerStats.cleanliness },
        { icon: "⛽", val: playerStats.fuel },
      ].map((item, i) => (
        <div key={i} className="col-6">
          <div className="d-flex align-items-center gap-2">
            <span>{item.icon}</span>
            <div className="progress flex-grow-1" style={{ height: 6 }}>
              <div
                className={`progress-bar ${getBarColor(item.val)}`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* AUDIO + BURGER */}
    <div className="d-flex gap-2 mt-3">
      <div className="flex-grow-1">
        <small>🎵 Music</small>
        <Form.Range
          min={0}
          max={1}
          step={0.05}
          value={musicVolume}
          onChange={(e) => setMusicVolume(+e.target.value)}
        />
      </div>

      <div className="flex-grow-1">
        <small>🔔 SFX</small>
        <Form.Range
          min={0}
          max={1}
          step={0.05}
          value={sfxVolume}
          onChange={(e) => setSfxVolume(+e.target.value)}
        />
      </div>

      <Button
        variant="light"
        onClick={() => setIsBurgerMenuOpen(true)}
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      >
        <img src="/burger-bar.png" alt="menu" width="100%" />
      </Button>
    </div>
  </div>
);

/* ======================
   DESKTOP SIDEBAR
   ====================== */
const DesktopSidebar = ({
  playerName,
  playerStats,
  currentTime,
  activityMode,
  getGreeting,
  getBarColor,
  musicVolume,
  sfxVolume,
  setMusicVolume,
  setSfxVolume,
}) => (
  <div
    className="d-none d-md-flex flex-column position-fixed start-0 top-0 h-100 p-3 shadow bg-white"
    style={{ width: 260, zIndex: 1000 }}
  >
    <h6 className="mb-2">
      {getGreeting()}, <strong>{playerName}</strong>
    </h6>

    <div className="mb-3 text-center">
      <div className="fw-bold fs-5">{formatTime(currentTime)}</div>
      {activityMode === "fastforward" && (
        <small className="text-warning">⏩ Fast Forward</small>
      )}
    </div>

    <div className="mb-3">
      💎 <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
    </div>

    {[
      { icon: "🍴", val: playerStats.meal },
      { icon: "🛏️", val: playerStats.sleep },
      { icon: "😊", val: playerStats.happiness },
      { icon: "🫧", val: playerStats.cleanliness },
      { icon: "⛽", val: playerStats.fuel },
    ].map((item, i) => (
      <div key={i} className="mb-2">
        <small>{item.icon}</small>
        <div className="progress" style={{ height: 8 }}>
          <div
            className={`progress-bar ${getBarColor(item.val)}`}
            style={{ width: `${item.val}%` }}
          />
        </div>
      </div>
    ))}

    <div className="mt-3">
      <small>🎵 Music</small>
      <Form.Range
        min={0}
        max={1}
        step={0.05}
        value={musicVolume}
        onChange={(e) => setMusicVolume(+e.target.value)}
      />

      <small className="d-block mt-2">🔔 SFX</small>
      <Form.Range
        min={0}
        max={1}
        step={0.05}
        value={sfxVolume}
        onChange={(e) => setSfxVolume(+e.target.value)}
      />
    </div>
  </div>
);

/* ======================
   HEADER BAR (MAIN)
   ====================== */
const HeaderBar = () => {
  const {
    playerStats,
    gameState,
    playerName,
    currentTime,
    activityState,
    setIsBurgerMenuOpen,
  } = useGame();

  const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } =
    useGameAudio(gameState);

  if (gameState !== "playing") return null;

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    if (h < 20) return "Good Evening";
    return "Good Night";
  };

  const getBarColor = (v) =>
    v > 50 ? "bg-success" : v > 25 ? "bg-warning" : "bg-danger";

  return (
    <>
      <MobileHeader
        playerName={playerName}
        playerStats={playerStats}
        currentTime={currentTime}
        activityMode={activityState?.mode}
        getGreeting={getGreeting}
        getBarColor={getBarColor}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        setMusicVolume={setMusicVolume}
        setSfxVolume={setSfxVolume}
        setIsBurgerMenuOpen={setIsBurgerMenuOpen}
      />

      <DesktopSidebar
        playerName={playerName}
        playerStats={playerStats}
        currentTime={currentTime}
        activityMode={activityState?.mode}
        getGreeting={getGreeting}
        getBarColor={getBarColor}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        setMusicVolume={setMusicVolume}
        setSfxVolume={setSfxVolume}
      />
    </>
  );
};

export default HeaderBar;
