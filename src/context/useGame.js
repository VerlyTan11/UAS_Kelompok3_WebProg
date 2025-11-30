import { useContext } from 'react';
import { GameContext } from './GameContext_Declarations.js'; 

export const useGame = () => useContext(GameContext);