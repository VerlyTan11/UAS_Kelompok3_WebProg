import React, { useState } from "react";
import { Card, Button, Form, Image, Modal } from "react-bootstrap";
import { useGame } from "../context/useGame";

const avatarList = [
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png",
  "/avatar4.png",
];

const InitialScreen = () => {
  const { startGame, setSelectedAvatar } = useGame();
  const [name, setName] = useState("");
  const [index, setIndex] = useState(0);

  // Modal state
  const [showRules, setShowRules] = useState(false);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + avatarList.length) % avatarList.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % avatarList.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");

    if (setSelectedAvatar) setSelectedAvatar(avatarList[index]);
    setShowRules(true); // show modal first
  };

  // Final start game when user accepts rules
  const confirmStartGame = () => {
    setShowRules(false);
    startGame(name.trim());
  };

  return (
    <>
      {/* MAIN SCREEN */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          style={{
            maxWidth: "90%",
            width: "25rem",
            border: "none",
            borderRadius: "20px",
            paddingTop: "10px",
          }}
          className="text-center shadow mx-auto my-3"
        >
          <div className="text-center py-4 border-bottom border-dark">
            <h3 className="mb-0">
              <img
                src="/footprint.gif"
                alt="steps"
                style={{ width: "13%", marginBottom: "10px" }}
              />
              <br />
              UMN - Ucup Exploring the Archipelago
            </h3>
          </div>

          {/* Avatar Carousel */}
          <div className="position-relative mt-3">
            <Button
              variant="light"
              onClick={handlePrev}
              className="shadow-sm cursor-target"
              style={{
                position: "absolute",
                left: "12%",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            >
              {"<"}
            </Button>

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

            <Button
              variant="light"
              onClick={handleNext}
              className="shadow-sm cursor-target"
              style={{
                position: "absolute",
                right: "12%",
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

      {/* 🎴 RULES MODAL */}
      <Modal show={showRules} onHide={() => setShowRules(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📜 Game Rules</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1rem", lineHeight: "1.5" }}>
          <ul>
            <li>⚠ Maintain hunger, sleep, happiness, and cleanliness.</li>
            <li>🗺 Explore areas and unlock activities.</li>
            <li>
              🎒 Some items are single–use, some only work in specific areas and
              some others can unlock certain activities.
            </li>
            <li>💸 Money affects your choices — use wisely.</li>
            <li>
              🏆 Your final score depends on balance, activities, and
              exploration.
            </li>
          </ul>

          <p className="fw-bold text-center mt-3">
            Are you ready to explore Indonesia with Ucup? 🌍
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRules(false)}
            className="cursor-target"
          >
            Back
          </Button>
          <Button
            variant="success"
            onClick={confirmStartGame}
            className="cursor-target"
          >
            🚀 I Understand — Play!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InitialScreen;
