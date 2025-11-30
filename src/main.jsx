import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameProvider } from './context/GameContext'; // Import provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
);