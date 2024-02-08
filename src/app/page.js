import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>La Goyco Noise Monitoring | Home </title>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <div className="wrapper">
        <header>
          <div className="navbar">
            <ul className="navlinks">
              <li className="current">
                <a href="/">Noise Pollution in La Goyco</a>
              </li>
              <li>
                <Link href="/about.html">
                  About
                </Link>
              </li>
              <li>
                <Link href="/map.html">
                  Map
                </Link>
              </li>
              <li>
                <Link href="/handbook.html">
                  Handbook
                </Link>
              </li>
            </ul>
            <div className="languageSelect">
              <button className="langBtn">🌐 English ▾</button>
              <div className="langOptions">
                <div className="lang">🌐 English</div>
                <div className="lang">🌐 Español</div>
              </div>
            </div>
          </div>
          <div className="navspace"></div>
        </header>

        <div className="main">
          <h1>Noise Pollution in La Goyco</h1>
        </div>

        <div className="pages">
          <div className="page">
            <h2>Noise Pollution</h2>
            <p>
              Learn more about the issue of noise pollution, health implications, and noise policies in Puerto Rico.
            </p>
            <Link href="/about.html">
              Learn more about the project
            </Link>
          </div>

          <div className="page">
            <h2>Noise Map</h2>
            <Image
              src="/map.png"
              alt="noise map"
              width={300}
              height={200} />
            <p>View the collected data and contribute to noise monitoring.</p>
            <Link href="/map">
              Contribute and see data
            </Link>
          </div>

          <div className="page">
            <h2>Policy Handbook</h2>
            <p>Learn about actions you can take to combat noise pollution.</p>
            <Link href="/handbook">
              Policy resources and overview
            </Link>
          </div>
        </div>

        <footer>
          <p>placeholder for links and copyright and whatnot</p>
        </footer>
      </div>

      <script defer src="/script.js"></script>
    </>
  );
}
