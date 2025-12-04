import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RootContent from "./components/RootContent";
import "./App.css";

const App = () => {
  return (
    <Router>
      <RootContent />
    </Router>
  );
};

export default App;
