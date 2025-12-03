import React from "react";
import { useGame } from "../context/useGame";

const HeaderBar = () => {
  const { playerStats, gameState, playerName, currentTime } = useGame();

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
      className="border border-dark mb-3"
      style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#fff" }}
    >
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center py-2 px-3 border-bottom border-top">
        <div>
          {getGreeting()} <strong>{playerName}</strong>
        </div>

        <div>
          <strong>
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </div>

        <div className="d-flex align-items-center">
          <span className="me-2">💰</span>
          <strong>{playerStats.money.toLocaleString("id-ID")}</strong>
        </div>
      </div>

      {/* Stats */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        {[
          { icon: "🍴", val: playerStats.meal, label: "Meal" },
          { icon: "🛏️", val: playerStats.sleep, label: "Sleep" },
          { icon: "😊", val: playerStats.happiness, label: "Happiness" },
          { icon: "🫧", val: playerStats.cleanliness, label: "Cleanliness" },
        ].map((item, i) => (
          <div key={i} className="d-flex align-items-center" title={item.label}>
            <span className="me-1">{item.icon}</span>
            <div
              className="progress"
              style={{ width: "100px", height: "10px" }}
            >
              <div
                className={`progress-bar ${getBarColor(item.val)}`}
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderBar;
