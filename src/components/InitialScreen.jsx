import React, { useState } from "react";
import { Card, Button, Form, Image } from "react-bootstrap";
import { useGame } from "../context/useGame";

// Ambil avatar dari folder public
// Pastikan folder: public/avatars/
const avatarList = [
  "../../public/avatar1.png",
  "../../public/avatar2.png",
  "../../public/avatar3.png",
  "../../public/avatar4.png",
];

const InitialScreen = () => {
  const { startGame, setSelectedAvatar } = useGame();
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);

  // Slider kiri
  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + avatarList.length) % avatarList.length);
  };

  // Slider kanan
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % avatarList.length);
  };

  // Mulai game
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");

    if (setSelectedAvatar) setSelectedAvatar(avatarList[index]);
    startGame(name.trim());
  };

  return (
    <div
      // Gunakan minHeight: "100vh" agar selalu di tengah halaman pada layar manapun
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          // Gunakan max-width agar responsif dan padding responsif
          maxWidth: "90%",
          width: "25rem",
          border: "none",
          borderRadius: "20px",
          paddingTop: "10px",
        }}
        className="text-center shadow mx-auto my-3" // mx-auto dan my-3 untuk responsif
      >
        <div className="text-center py-4 border-bottom border-dark">
          <h3 className="mb-0">
            <span role="img" aria-label="steps">
              <img
                src="../../public/footprint.gif"
                alt=""
                style={{ width: "10%", marginBottom: "10px" }}
              />
            </span>
            <br />
            UMN - Ucup Exploring the Archipelago
          </h3>
        </div>
        {/* Avatar Carousel */}
        <div className="position-relative mt-3">
          {/* Tombol kiri - Sesuaikan posisi kiri agar responsif */}
          <Button
            variant="light"
            onClick={handlePrev}
            className="shadow-sm cursor-target"
            style={{
              position: "absolute",
              left: "15%", // Ganti 70px dengan persentase untuk responsif
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          >
            {"<"}
          </Button>

          {/* Avatar */}
          <Image
            src={avatarList[index]}
            roundedCircle
            className="shadow-sm"
            style={{
              width: "140px",
              height: "140px",
              border: "4px solid #3b82f6",
            }}
          />

          {/* Tombol kanan - Sesuaikan posisi kanan agar responsif */}
          <Button
            variant="light"
            onClick={handleNext}
            className="shadow-sm cursor-target"
            style={{
              position: "absolute",
              right: "15%", // Ganti 70px dengan persentase untuk responsif
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          >
            {">"}
          </Button>
        </div>

        <Card.Body>
          {/* Input Nama */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 cursor-target">
              <Form.Control
                type="text"
                placeholder="Enter your name here..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-center border-dark"
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>

            {/* Tombol Mulai */}
            <Button
              variant="success"
              type="submit"
              className="w-100 cursor-target"
              style={{
                borderRadius: "10px",
                padding: "10px 0",
                fontSize: "1.1rem",
              }}
            >
              Start Exploring
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InitialScreen;
