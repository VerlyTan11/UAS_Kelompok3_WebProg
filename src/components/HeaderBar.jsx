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
      {/* Gunakan justify-content-start agar tombol burger tidak terdorong ke paling kanan oleh stats */}
      <div className="d-flex flex-wrap justify-content-start align-items-center px-3 py-2 border-bottom">
        {/* Stats - Gunakan row dan col classes untuk responsif */}
        {/* Kurangi me-md-3 agar ada ruang untuk tombol burger di mobile jika terjadi wrap */}
        <div className="row g-1 flex-grow-1 me-2">
          {[
            { icon: "🍴", val: playerStats.meal, label: "Meal" },
            { icon: "🛏️", val: playerStats.sleep, label: "Sleep" },
            { icon: "😊", val: playerStats.happiness, label: "Happiness" },
            { icon: "🫧", val: playerStats.cleanliness, label: "Cleanliness" },
          ].map((item, i) => (
            // col-6: 50% lebar di mobile/tablet. col-md-3: 25% lebar di desktop
            <div key={i} className="col-6 col-md-3 my-1" title={item.label}>
              <div className="d-flex align-items-center justify-content-start pe-2">
                <span className="me-1">{item.icon}</span>
                <div
                  // FIX: progress bar menggunakan flex-grow-1 untuk mengisi ruang yang tersedia
                  className="progress flex-grow-1"
                  style={{ height: "10px" }} // Hapus maxWidth
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
        {/* Posisikan tombol ini di luar 'row' tapi di dalam 'd-flex flex-wrap' agar bisa diletakkan di baris kedua jika perlu */}
        <Button
          // FIX: Ganti kembali ke variant dark/default agar warnanya terlihat (atau hapus bg/border override)
          className="ms-3 d-md-none cursor-target bg-white border-0"
          onClick={() => setIsBurgerMenuOpen(true)}
          style={{
            minWidth: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            margin: "10px",
            marginRight: "30px",
            flexShrink: 0,
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
