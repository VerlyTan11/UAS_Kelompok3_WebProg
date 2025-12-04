import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContext_Declarations"; 

export const useGameRouter = () => {
  const context = useContext(GameContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useGameRouter must be used within a GameProvider");
  }

  return { ...context, navigate };
};
