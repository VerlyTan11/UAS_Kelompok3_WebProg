import React from "react";
import { useGame } from "../context/useGame";
import { Button } from "react-bootstrap";

const HeaderBar = () => {
  // Ambil setIsBurgerMenuOpen
  const {
    playerStats,
    gameState,
    playerName,
    currentTime,
    setIsBurgerMenuOpen,
  } = useGame();

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

  return (
    <div
      className="border border-dark mb-3 mx-auto"
      style={{ maxWidth: "1000px", backgroundColor: "#fff" }}
    >
      {/* Top Bar: Sapaan, Jam, dan Uang */}
      {/* FIX: Gunakan px-2 di semua ukuran untuk menghemat ruang horizontal */}
      <div className="d-flex justify-content-between align-items-center py-2 px-2 border-bottom border-top">
        {/* Sapaan (Kiri) - Batasi lebar agar money dan jam muat */}
        <div className="text-truncate me-2 fs-6" style={{ maxWidth: "30%" }}>
          {getGreeting()} <strong>{playerName}</strong>
        </div>

        {/* Jam (Tengah) */}
        <div className="flex-shrink-0 mx-1 fs-6">
          <strong>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </div>

        {/* Money (Kanan) - Gunakan kelas text-end di mobile */}
        <div className="d-flex align-items-center flex-shrink-0 ms-1 fs-6">
          <span className="me-1">💰</span>
          <strong className="small">
            {playerStats.money.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      {/* Stats Bar: Stats dan Tombol Burger */}
      <div className="d-flex justify-content-start align-items-center px-2 py-2 border-bottom">
        {/* Stats Container */}
        <div className="row g-0 flex-grow-1 me-2">
          {[
            { icon: "🍴", val: playerStats.meal, label: "Meal" },
            { icon: "🛏️", val: playerStats.sleep, label: "Sleep" },
            { icon: "😊", val: playerStats.happiness, label: "Happiness" },
            { icon: "🫧", val: playerStats.cleanliness, label: "Cleanliness" },
          ].map((item, i) => (
            <div key={i} className="col-6 col-md-3 my-1" title={item.label}>
              <div className="d-flex align-items-center justify-content-start px-1">
                <span className="me-1 flex-shrink-0">{item.icon}</span>
                <div
                  className="progress flex-grow-1"
                  style={{ height: "10px" }}
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

        <Button
          className="ms-2 d-md-none cursor-target flex-shrink-0 bg-white border-0"
          onClick={() => setIsBurgerMenuOpen(true)}
          style={{
            minWidth: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <img
            src={"/burger-bar.png"}
            alt="Menu"
            style={{ width: "100%", height: "100%" }}
          />
        </Button>
      </div>
    </div>
  );
};

export default HeaderBar;
