// LeafletMap.tsx
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";

const defaultLatLng: LatLngTuple = [18.4518, -66.0597];
const zoom: number = 16;

const LeafletMap: React.FC = () => {
  return (
    <div>
      <div className="page flex">
        <div id="map">
          <MapContainer
            id="mapId"
            style={{
              height: "100%",
              width: "100%",
            }}
            center={defaultLatLng}
            zoom={zoom}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>

        <div id="map-info" className="map-txt">
          <h2>Noise Map</h2>
          <p>This is a map of noise data collected by the community!</p>
          <p>
            Click on a square on the grid to see data from that area. A report
            may include the decibel level, type of noise (traffic, wildlife,
            music, etc.), and perceived loudness.
          </p>
          <button className="report-btn" id="reportBtn">
            Add to the map!
          </button>
        </div>

        <div id="map-report" className="map-txt">
          <button id="back">X</button>
          <h2>Your Data</h2>
          <p>Decibel level optional</p>
          <form>
            <label htmlFor="decibel">Decibel Level:</label>
            <input
              type="number"
              id="decibel"
              name="decibel"
              min="25"
              max="140"
            />

            <p>
              Location (add tooltip to talk about exact location + privacy):
            </p>
            <label htmlFor="location">Location:</label>
            <div className="number">
              <input type="integer" id="locate" />
            </div>
            <button>Use current location</button>
            <button>Pick location on map</button>

            <label htmlFor="perception">
              On a scale of 1 to 10 how loud was it:
            </label>
            <div className="slidecontainer">
              <input
                type="range"
                min="1"
                max="10"
                value="5"
                className="slider"
                id="perception"
              />
              <output id="perception-num">5</output>
            </div>

            <p>Types of noise present</p>
            <div className="typecontainer">
              <div className="type">
                <input
                  type="checkbox"
                  id="type1"
                  name="type1"
                  value="traffic"
                />
                <label htmlFor="type1"> traffic</label>
                <br />
              </div>
              <div className="type">
                <input
                  type="checkbox"
                  id="type2"
                  name="type2"
                  value="wildlife"
                />
                <label htmlFor="type2"> wildlife</label>
                <br />
              </div>
              <div className="type">
                <input
                  type="checkbox"
                  id="type3"
                  name="type3"
                  value="construction"
                />
                <label htmlFor="type3"> construction</label>
                <br />
              </div>
            </div>

            <button className="submit-btn" id="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="wrapper-space"></div>
      <footer>
        <p>placeholder for links and copyright and whatnot</p>
      </footer>
    </div>
  );
};

export default LeafletMap;