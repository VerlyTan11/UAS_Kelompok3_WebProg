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
      {/* Top Bar: Sapaan, Jam, dan Uang dalam 1 baris di semua ukuran */}
      <div className="d-flex flex-wrap justify-content-between align-items-center py-2 px-3 border-bottom border-top">
        {/* Sapaan (Kiri) */}
        <div>
          {getGreeting()} <strong>{playerName}</strong>
        </div>

        {/* Jam (Tengah) */}
        <div>
          <strong>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </div>

        {/* Money (Kanan) */}
        <div className="d-flex align-items-center">
          <span className="me-2">💰</span>
          <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
        </div>
      </div>

      {/* Stats Bar: Stats dan Tombol Burger */}
      <div className="d-flex flex-wrap justify-content-between align-items-center px-3 py-2 border-bottom">
        {/* Stats - Gunakan row dan col classes untuk responsif */}
        <div className="row g-1 flex-grow-1 me-md-3">
          {[
            { icon: "🍴", val: playerStats.meal, label: "Meal" },
            { icon: "🛏️", val: playerStats.sleep, label: "Sleep" },
            { icon: "😊", val: playerStats.happiness, label: "Happiness" },
            { icon: "🫧", val: playerStats.cleanliness, label: "Cleanliness" },
          ].map((item, i) => (
            // FIX: Gunakan col-6 untuk 2 kolom di mobile, col-md-3 untuk 4 kolom di desktop
            <div key={i} className="col-6 col-md-3 my-1" title={item.label}>
              <div className="d-flex align-items-center justify-content-start pe-2">
                <span className="me-1">{item.icon}</span>
                <div
                  // FIX: Hapus properti width, gunakan flex-grow-1
                  className="progress flex-grow-1"
                  style={{ height: "10px", maxWidth: "100px" }} // Batasi MaxWidth agar tidak terlalu panjang di layar sangat besar
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

        {/* Tombol Burger - MENGGUNAKAN IMAGE KUSTOM */}
        <Button
          className="ms-3 d-md-none cursor-target bg-white border-0"
          onClick={() => setIsBurgerMenuOpen(true)}
          style={{
            width: "40px",
            height: "40px",
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
