// src/components/BurgerMenu.jsx
import React from "react";
import { Modal } from "react-bootstrap";
import { useGame } from "../context/useGame";
import PlayerItemsContent from "./PlayerItemsContent"; // Akan dibuat di langkah 3

const BurgerMenu = () => {
  const { isBurgerMenuOpen, setIsBurgerMenuOpen } = useGame();

  const handleClose = () => setIsBurgerMenuOpen(false);

  return (
    <Modal show={isBurgerMenuOpen} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Player's Inventory</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Konten PlayerItems dipisahkan agar bisa digunakan di sini dan di sidebar desktop */}
        <PlayerItemsContent />
      </Modal.Body>
    </Modal>
  );
};

export default BurgerMenu;
