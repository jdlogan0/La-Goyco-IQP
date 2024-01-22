// Handbook.tsx
import React from "react";

const Handbook: React.FC = () => {
  return (
    <div>
      <div className="flex handbook">
        <div className="page" id="handbook-nav">
          <h2>Contents</h2>
          <a href="#intro">Introduction</a>
          <a href="#policy">Noise Policy</a>
          <a href="#traffic">Traffic</a>
          <a href="#bars">Bars</a>
          <a href="#resources">More Resources</a>
          <a href="#sources">Sources</a>
        </div>
        <div className="page" id="handbook-txt">
          <h2 id="intro">Introduction</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            faucibus ante sit amet venenatis pharetra. Nam a lobortis mi, eu
            cursus elit. Praesent lacinia magna sem, ut aliquet sapien efficitur
            id. Fusce lorem velit, tempus et felis et, lacinia facilisis orci.
            Aenean feugiat finibus laoreet. Curabitur in odio velit. Phasellus
            metus velit, vulputate eget nunc quis, luctus tincidunt nisl. In
            mauris orci, sodales ut lorem et, iaculis luctus orci. Sed ac
            tincidunt metus. Phasellus mi ligula, lobortis ac hendrerit vitae,
            lacinia quis est. Sed eu placerat dui. Aliquam turpis arcu, placerat
            nec efficitur sit amet, tristique sit amet lacus.
          </p>
          <h2 id="policy">Noise Policy</h2>
          <p>
            Phasellus hendrerit, risus sit amet egestas accumsan, elit nunc
            lobortis tortor, nec congue lectus lectus in lorem. In iaculis nisi
            vel mauris viverra, vitae aliquet lectus molestie. Mauris aliquet,
            enim et pellentesque ornare, ante ipsum dictum nibh, sed faucibus
            tellus magna in lectus. Nunc eu volutpat elit, in rutrum purus.
            Pellentesque felis diam, sollicitudin at ante nec, ultricies
            volutpat lectus. Vestibulum maximus scelerisque libero, a tincidunt
            eros maximus id. Quisque auctor ex at lorem interdum, a faucibus
            sapien sollicitudin. Donec maximus mollis lorem, sed accumsan diam
            facilisis quis. Duis pellentesque sem nibh, id pretium purus tempor
            vitae. Phasellus ultrices ex sed feugiat elementum. Morbi volutpat
            diam non nisl pretium tristique. Praesent lorem ex, rhoncus eu ante
            at, interdum sagittis massa. Nulla eros nisi, gravida non massa ut,
            varius pellentesque arcu.
          </p>
          <p>
            Pellentesque et ante sed metus sagittis feugiat vel at justo.
            Maecenas tempus mollis justo. Fusce nulla sem, semper et condimentum
            nec, sagittis porta dolor. Nulla facilisi. Mauris sodales efficitur
            orci, eget pellentesque metus aliquam quis. Donec nec leo vel risus
            ornare rutrum. Vivamus feugiat cursus dolor et mattis. Nulla dictum
            blandit nunc, vel malesuada orci vestibulum a. Vestibulum tincidunt
            lectus mi, quis placerat orci semper eget.
          </p>
          <h2 id="traffic">Traffic</h2>
          <p>
            Aenean volutpat, erat at posuere efficitur, purus leo porttitor
            urna, sed tempus arcu urna non elit. Sed pretium nec massa nec
            suscipit. Phasellus a tortor sed lacus dapibus hendrerit. Curabitur
            et rhoncus nisl. Nulla ac neque id lorem commodo cursus sed in
            magna. Maecenas a lectus nec magna rhoncus egestas. Cras gravida
            metus eu elit scelerisque accumsan. Sed efficitur metus magna, quis
            accumsan est mollis ut. Quisque maximus neque nec metus imperdiet,
            nec laoreet velit maximus. Quisque molestie eget quam in congue. In
            lobortis efficitur purus id aliquam. Maecenas semper augue lorem.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Donec turpis mi, ultrices pharetra ipsum
            id, laoreet sollicitudin leo. Aliquam ante enim, euismod in lacus
            id, porta tempor justo. Morbi faucibus varius magna, eget pulvinar
            dui porta id.
          </p>
          <h2 id="bars">Bars</h2>
          <p>
            Vivamus et ligula orci. In in sodales lectus. Sed fringilla dui
            lobortis ante interdum maximus. In eget vehicula magna. Vestibulum
            gravida purus eu odio sollicitudin, a tincidunt velit vestibulum.
            Praesent lorem ante, lobortis euismod vestibulum ac, tempor non
            orci. Morbi eget justo est.
          </p>
          <h2 id="resources">More Resources</h2>
          <h2 id="sources">Sources</h2>
        </div>
      </div>

      <div className="wrapper-space"></div>
      <footer>
        <p>placeholder for links and copyright and whatnot</p>
      </footer>
    </div>
  );
};

export default Handbook;
