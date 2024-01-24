import React from "react";

const About: React.FC = () => {
  return (
    <div>
      <div className="page" id="about">
        <h2>About</h2>
        <p>
          A nice little paragraph that more or less reiterates the stuff from
          the homepage and encourages you to continue reading for specifics.
          Noise pollution is bad, health effects, ways to reduce, mapping is
          useful, etc.
        </p>
        <p>quick overview of current noise law here</p>
        <p>link to Anna's slideshow and data probably</p>
      </div>

      <div className="wrapper-space"></div>
      <footer>
        <p>placeholder for links and copyright and whatnot</p>
      </footer>
    </div>
  );
};

export default About;