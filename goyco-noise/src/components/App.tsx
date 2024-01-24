// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import About from "./About.tsx";
import MapPage from "./Map.tsx";
import Handbook from "./Handbook.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/handbook" element={<Handbook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;