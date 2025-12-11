// src/components/DeveloperBadge.jsx

import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Code, Info } from "lucide-react";

const developers = [
  { name: "Beverly Vladislav Tan", role: "Fullstack Developer", avatar: "/avatar1.png" },
  { name: "Saint Christopher Shyandon", role: "Backend Developer", avatar: "/avatar2.png" },
  { name: "Dylan", role: "Frontend Developer", avatar: "/avatar3.png" },
];

const DeveloperBadge = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Style untuk container badge (fixed position di kiri bawah)
  const containerStyle = {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-end",
    transition: "all 0.3s ease",
  };

  // Style untuk setiap avatar
  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #fff",
    backgroundColor: "#4a90e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "0.8rem",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  // Style untuk expanded info box
  const infoBoxStyle = {
    position: "absolute",
    bottom: "0px",
    left: "55px", // Di sebelah badge
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "8px",
    padding: "10px 15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "250px",
    backdropFilter: "blur(5px)",
    transformOrigin: "bottom left",
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Info Box (Muncul di sebelah) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
        style={infoBoxStyle}
      >
        <h6
          style={{
            fontSize: "1rem",
            margin: 0,
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Code size={18} /> Development Team
        </h6>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {developers.map((dev, i) => (
            <li
              key={dev.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                gap: "10px",
              }}
            >
              <img
                src={dev.avatar}
                alt={dev.name}
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ fontSize: "0.9rem", lineHeight: "1.2" }}>
                <strong style={{ display: "block" }}>{dev.name}</strong>
                <small style={{ color: "#555", fontSize: "0.75rem" }}>
                  {dev.role}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Primary Hover Trigger Badge */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isHovered ? 0 : 0 }}
        style={{ position: "relative", marginRight: "10px" }}
      >
        <div style={avatarStyle}>
          <Users size={20} />
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperBadge;
