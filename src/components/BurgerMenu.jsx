// src/components/BurgerMenu.jsx
import React from "react";
import { Modal } from "react-bootstrap";
import { useGame } from "../context/useGame";
import PlayerItemsContent from "./PlayerItemsContent";

const BurgerMenu = () => {
  const { isBurgerMenuOpen, setIsBurgerMenuOpen } = useGame();

  const handleClose = () => setIsBurgerMenuOpen(false);

  return (
    // size="sm" otomatis menjadi full width di mobile
    <Modal
      show={isBurgerMenuOpen}
      onHide={handleClose}
      centered
      size="sm"
      dialogClassName="m-0 m-sm-auto"
    >
      <Modal.Header closeButton className="p-3">
        {" "}
        {/* FIX: Tambahkan padding agar tombol X tidak mepet */}
        <Modal.Title>Player's Inventory</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-0"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <PlayerItemsContent />
      </Modal.Body>
    </Modal>
  );
};

export default BurgerMenu;
