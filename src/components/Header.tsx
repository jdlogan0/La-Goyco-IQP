// Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header>
      <div className="navbar">
        <ul className="navlinks">
          <li className="current">
            <Link to="/">Noise Pollution in La Goyco</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/map">Map</Link>
          </li>
          <li>
            <Link to="/handbook">Handbook</Link>
          </li>
        </ul>
        <div className="language-select">
          <button className="lang-btn">🌐 English ▾</button>
          <div className="lang-options">
            <div className="lang">🌐 English</div>
            <div className="lang">🌐 Español</div>
          </div>
        </div>
      </div>
      <div className="navspace"></div>
    </header>
  );
};

export default Header;
