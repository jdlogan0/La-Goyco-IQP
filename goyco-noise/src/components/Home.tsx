import React from "react";

const Home: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="main">
        <h1>Noise Pollution in La Goyco</h1>
      </div>

      <div className="pages">
        <div className="page">
          <h1> About</h1>
        </div>

        <div className="page">
          <h1> Map</h1>
        </div>

        <div className="page">
          <h1> Handbook</h1>
        </div>
      </div>

      <div className="wrapper-space"></div>

      <footer>
        <p>placeholder for links and copyright and whatnot</p>
      </footer>
    </div>
  );
};

export default Home;