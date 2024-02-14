
/* ==========================================================================
General map setup
========================================================================== */
//size of grid tiles
let gridSize = .00072;

//mode for picking location on map (prevent clicking tile)
let locationMode = false;

let map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 12,
    maxBoundsViscosity: 1.0,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//bounds of map
let bounds = [[18.454596, -66.066049], [18.447085, -66.050838]]
map.fitBounds(bounds);
//map.setMaxBounds(bounds);

// polygon for monitoring area
let goycoCoords = [
    [18.454494, -66.063388],
    [18.45427, -66.061994],
    [18.454026, -66.061672],
    [18.453619, -66.061522],
    [18.453191, -66.061136],
    [18.452662, -66.059484],
    [18.45258, -66.05766],
    [18.451868, -66.051911],
    [18.451624, -66.051031],
    [18.449955, -66.051289],
    [18.449955, -66.051503],
    [18.447471, -66.051632],
    [18.447614, -66.053391],
    [18.447655, -66.054829],
    [18.448021, -66.056695],
    [18.448448, -66.058669],
    [18.448489, -66.058948],
    [18.44851, -66.059527],
    [18.448469, -66.062037],
    [18.44855, -66.062595],
    [18.448733, -66.063345],
    [18.448917, -66.063946],
    [18.450057, -66.065791],
    [18.452072, -66.06386],
    [18.453374, -66.063539]
]
const goyco = L.polygon(goycoCoords, { color: '#424242', fill: false }).addTo(map);


function getColorDB(dB) {
    let color = ""
    if (dB == null) { color = "#6b7e9c"; }
    else if (dB < 10) { color = "#48f702"; }
    else if (dB < 10) { color = "#69f702"; }
    else if (dB < 30) { color = "#89f702"; }
    else if (dB < 40) { color = "#a6f702"; }
    else if (dB < 50) { color = "#b6f702"; }
    else if (dB < 60) { color = "#caf702"; }
    else if (dB < 70) { color = "#e7f702"; }
    else if (dB < 80) { color = "#f7ef02"; }
    else if (dB < 90) { color = "#f7c602"; }
    else if (dB < 100) { color = "#f79902"; }
    else if (dB < 110) { color = "#f77d02"; }
    else if (dB < 130) { color = "#f76002"; }
    else if (dB < 140) { color = "#f73802"; }
    else { color = "#f70202"; };
    return color;
}

//button for recentering map
L.Control.Recenter = L.Control.extend({
    onAdd: function(map) {
        let btn = L.DomUtil.create('button');
        btn.innerHTML = "Back to Goyco";
        btn.style.padding = "5px";
        btn.style.fontFamily = "inherit";

        L.DomEvent.on(btn, "click", function (e) {
            L.DomEvent.stopPropagation(e);
            map.fitBounds(bounds);
        });

        return btn;
    },

    onRemove: function(map) {
        L.DomEvent.off();
    }
});

L.control.recenter = function(opts) {
    return new L.Control.Recenter(opts);
}

L.control.recenter({ position: 'topright' }).addTo(map);

/* ==========================================================================
GeoJSON Stuff
Worth noting GeoJSON goes [long, lat] unlike Leaflet's [lat, long]
geojson var from geojson.js for organization purposes
========================================================================== */

let geoData;
let geoLayer;

//fetch GeoJSON data
fetch('/api/getTiles')
    .then(response => response.json())
    .then(data => {
        geoData = data;

        // add GeoJSON Layer
        geoLayer = L.geoJSON(geoData, {
            style: styleGeo,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error fetching GeoJSON data:', error);
    });


function styleGeo(feature) {
    let thisStyle = {
        color: "white",
        weight: 2,
        fillOpacity: 0.6,
        stroke: false,
        fillColor: "#ff0000"
    };

    //assign color based on average dB for tile
    let dB = feature.properties.avgdB;
    thisStyle.fillColor = getColorDB(dB);
    return thisStyle;
}

function onEachFeature(feature, layer) {

    //white outline with hover
    layer.on("mouseover", function (e) {
        layer.setStyle({
            stroke: true,
        });
    });

    //no outline when mouse leaves
    layer.on("mouseout", function (e) {
        layer.setStyle({
            stroke: false,
        });
    });

    //show data if clicked 
    layer.on("click", function (e) {
        if (locationMode == false) {
            showData(feature.properties, feature.geometry.coordinates[0]);
        }
    });
}

//for picking location by clicking map
function onMapClick(e) {
    if (locationMode == true) {
        handleLoc(e.latlng.lat, e.latlng.lng);
    }
}
map.on('click', onMapClick);


/* ==========================================================================
Input for adding data to the map
========================================================================== */

//local vars for responses
let reportTile;

let testTile = L.polygon([[0,0]], {color: '#424242'}).addTo(map);
let testMarker = L.marker([0,0]).addTo(map);

let reportData =
{
    "decibel": {
        "avg": 60,
        "max": 70,
        "device": ""
    },
    "date": "",
    "time": "",
    "loudness": 5,
    "feeling": "",
    "tags": []
}

const backData = document.getElementById("backData");
const backReport = document.getElementById("backReport");
const info = document.getElementById("mapInfo");
const report = document.getElementById("mapReport");
const data = document.getElementById("mapData");
const dataBlocks = document.getElementById("dataBlocks");
const tName = document.getElementById("tileName");
const reportbtn = document.getElementById("reportBtn");

const leavePopup = document.getElementById("leavePopup");

//hide/show main and report pages
backData.onclick = function () {
    info.style.display = "block";
    data.style.display = "none";
}
backReport.onclick = function () {
    leavePopup.style.display = "block";
}

const leaveForm = document.getElementById("leaveForm");
leaveForm.onclick = function () {
    info.style.display = "block";
    report.style.display = "none";
    leavePopup.style.display = "none";

    mapForm.reset();
    locationMode = false;
}
document.getElementById("stayForm").onclick = function () {
    leavePopup.style.display = "none";
}

reportbtn.onclick = function () {
    info.style.display = "none";
    data.style.display = "none";
    report.style.display = "block";

    locationMode = true;
}


//Location
const curLoc = document.getElementById("curLoc");
curLoc.onclick = (event) => {
    event.preventDefault();
    if ("geolocation" in navigator) {
        alert("why");
        navigator.geolocation.getCurrentPosition((position) => {
            handleLoc(position.coords.latitude, position.coords.longitude);
        });
    }
    else {
        alert("Geolocation is not available");
    }

}
const tileZoom = document.getElementById("tileZoom");
tileZoom.onclick = (event) => {
    event.preventDefault();
    //zoom to test tile if it exists
    if (!(testTile.getCenter().equals(L.latLng(0, 0)))) {
        map.setView(testTile.getCenter(), 19);
    }
    
}

//calls the relevant functions after coords are selected through any method
function handleLoc(lat, long) {
    //if you want reports to be restricted to the monitoring area, uncomment checkBounds
    //let valid = checkBounds(lat, long);
    let valid = true;

    if (lat == null) {
        lat = parseFloat(document.getElementById("lat").value) - 0.000005;
        long = parseFloat(document.getElementById("long").value) + 0.000005;

        if ((isNaN(lat)) || (isNaN(long))) {
            valid = false;
        }
    }

    if (valid) {
        let tile = calcLocation(lat, long);
        displayLocCoords(tile[0], tile[1]);

        //show tile on map for confirmation

        let testlatlngs = [
            [tile[0], tile[1]],
            [tile[0], tile[1]+gridSize],
            [tile[0]-gridSize, tile[1]+gridSize],
            [tile[0]-gridSize, tile[1]]
        ];

        testMarker.setLatLng([lat, long]); 
        testTile.setLatLngs(testlatlngs);

        map.panTo(testTile.getCenter());
    }
    else {
        //invalidLoc();
    }
}

//check if point coordinates are within Goyco - ray casting
function checkBounds(x, y) {
    let polygon = goycoCoords;
    polygon.push(polygon[0]);
    let lineNum = polygon.length;

    let inside = false;

    //loop through polygon edges
    for (let i = 0; i < lineNum - 1; i++) {
        let edgePt1 = polygon[i], edgePt2 = polygon[i + 1];

        let pt1x = edgePt1[0], pt1y = edgePt1[1], pt2x = edgePt2[0], pt2y = edgePt2[1];

        let ptInYRange = (pt1y > y) != (pt2y > y);
        let isLeft = x < (pt2x - pt1x) * (y - pt1y) / (pt2y - pt1y) + pt1x;
        if (ptInYRange && isLeft) {
            inside = !inside;
        }
    }
    return inside;
}
//show error for coords outside of goyco
function invalidLoc() {
    alert("Coordinates outside of monitoring area boundaries");
}
//calculate tile coordinates given point
function calcLocation(lat, long) {
    let startPt = bounds[0];

    let distLat = startPt[0] - lat;
    let distLong = startPt[1] - long;

    let boxRow = Math.floor(distLat / gridSize);
    let boxCol = Math.floor(distLong / gridSize);

    let tileLat = startPt[0] - gridSize * boxRow;
    let tileLong = startPt[1] - gridSize * boxCol - gridSize;

    tileLat = Math.round(tileLat * 100000) / 100000;
    tileLong = Math.round(tileLong * 100000) / 100000;

    reportTile = [tileLat, tileLong];

    return (reportTile);
}
function displayLocCoords(lat, long) {
    const locLat = document.getElementById("lat");
    locLat.value = lat;
    const locLong = document.getElementById("long");
    locLong.value = long;
}

//Subjective loudness slider
const loudDesc = ["Silence", "Light noise (Ex: library)", "Everyday noise (Ex: conversation)", "Moderate noise (Ex: busy hotel lobby)", "Loud noise (Ex: concert)", "Unbearable levels of noise (Ex: jackhammer)"];
const loudRange = document.getElementById("perception");
const loudTxt = document.getElementById("loudTxt");
let loudCurrent = document.getElementById("perceptionNum");
loudCurrent.innerHTML = loudRange.value;
loudRange.oninput = function (e) {
    loudTxt.innerHTML = loudDesc[e.target.value];
    loudCurrent.innerHTML = this.value;
};

//Feeling slider
const emojis = ['😀', '🙂', '😐', '🙁', '😢'];
const feelingRange = document.getElementById("feeling");
const emoji = document.getElementById("emoji");
feelingRange.oninput = function (e) {
    emoji.innerHTML = emojis[e.target.value];
};


//tag stuff

let tagList = ["Car", "Motorcycle", "Traffic", "Construction", "Wildlife", "Music", "Restaurant", "Bar", "Rain", "Aircraft", "Indoor", "Outdoor"];
let userTags = [];
createTags();

document.getElementById("tagSearch").oninput = function (e) {
    e.preventDefault();
};

function createTags() {
    for (let i = 0; i < tagList.length; i++) {
        createTag(tagList[i]);
    }
}
function createTag(tag) {
    const tagDrop = document.getElementById("tagDropdown");
    const tagBtn = document.createElement("button");
    tagBtn.innerHTML = tag;
    tagBtn.type = "button";
    tagBtn.onclick = (event) => {
        event.preventDefault();
        addTag(tag);
        tagBtn.parentNode.removeChild(tagBtn);
    };
    tagDrop.appendChild(tagBtn);
}

function addTag(tag) {
    userTags.push(tag);

    const selectedTags = document.getElementById("selectedTags");
    const newTag = document.createElement("div");
    newTag.className = "tag";
    newTag.innerHTML = tag;

    const tagX = document.createElement("button");
    tagX.innerHTML = "X";
    tagX.className = "tagX";
    tagX.onclick = (event) => {
        event.preventDefault();
        userTags.splice(userTags.indexOf(tag), 1);
        createTag(tag);
        tagX.parentNode.parentNode.removeChild(newTag);
    };
    tagX.type = "button";
    newTag.appendChild(tagX);

    selectedTags.appendChild(newTag);

    document.getElementById("tagSearch").value = "";
    document.getElementById("tagDropdown").style.display = "none";
}

function hideTags(event) {
    if (event.relatedTarget != null) {
        if (event.relatedTarget.tagName == "BUTTON") {
            return;
        }
    }
    document.getElementById("tagSearch").value = "";
    document.getElementById("tagDropdown").style.display = "none";
}
  
function filterTags() {
    let input = document.getElementById("tagSearch");
    let filter = input.value.toUpperCase();
    let dropdown = document.getElementById("tagDropdown");
    let tags = dropdown.getElementsByTagName("button");
    let totalShown = 0;
    for (i = 0; i < tags.length; i++) {
      tagName = tags[i].innerText;
      if ((tagName.toUpperCase().indexOf(filter) > -1) && (totalShown < 5)){
        tags[i].style.display = "";
        totalShown += 1;
      } else {
        tags[i].style.display = "none";
      }
    }
    dropdown.style.display = "block";
}


//Submit form
const mapForm = document.getElementById("mapForm");
mapForm.addEventListener("submit", confirmSubmit);
function confirmSubmit(event) {
    event.preventDefault();
    document.getElementById("submitPopup").style.display = "block";
}
const confirmForm = document.getElementById("confirmForm");
confirmForm.addEventListener("submit", mapSubmit);

document.getElementById("popCancel").onclick = function () {
    document.getElementById("submitPopup").style.display = "none";
    confirmForm.reset();
}

async function mapSubmit(event) {
    event.preventDefault();
    document.getElementById("submitPopup").style.display = "none";
    confirmForm.reset();

    reportData.decibel.avg = parseInt(document.querySelector("#avg").value);
    reportData.decibel.max = parseInt(document.querySelector("#max").value);
    reportData.decibel.device = document.querySelector("#device").value;

    //check if decibel vals entered, if not set to null
    if (reportData.decibel.avg == null) {
        reportData.decibel = null;
    }

    reportData.date = document.querySelector("#date").value;
    reportData.time = document.querySelector("#time").value;
    reportData.loudness = parseInt(document.querySelector("#perception").value);
    reportData.feeling = parseInt(document.querySelector("#feeling").value);
    reportData.tags = userTags;

    addToTile();

    mapForm.reset();

    locationMode = false;

    info.style.display = "block";
    report.style.display = "none";
};

//SUBMIT NEW REPORTS
async function addToTile() {
    let tileExists = false;
    for (let i = 0; i < geoData.length; i++) {
        let longMatch = geoData[i].geometry.coordinates[0][0][0] == reportTile[1];
        let latMatch = geoData[i].geometry.coordinates[0][0][1] == reportTile[0];
        if (latMatch && longMatch) {

            try {
                const response = await fetch('/api/updateTile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tileCoord: reportTile,
                        data: reportData,
                    }),
                });

                if (response.ok) {
                    const result = await response.json();

                } else {
                    console.error('Error:', response.statusText);

                }
            } catch (error) {
                console.error('Error:', error.message);

            }
            tileExists = true;
            geoLayer.resetStyle();
        }
    }
    if (!tileExists) {
        createTile(reportTile, reportData);
    }
}

//create tile if none exist at that point
async function createTile(coords, data) {
    //flipped array for geojson
    let coordsArr = [
        [coords[1], coords[0]],
        [coords[1] + gridSize, coords[0]],
        [coords[1] + gridSize, coords[0] - gridSize],
        [coords[1], coords[0] - gridSize]
    ];
    let avgDecibel = null;
    if (data.decibel != null) {
        avgDecibel = data.decibel.avg;
    }
    let geoFormat = {
        "type": "Feature",
        "properties": {
            "avgdB": avgDecibel,
            "avgLoud": data.loudness,
            "data": [data]
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [coordsArr]
        }
    }

    // api call to add to db
    try {
        const response = await fetch('/api/addTile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                geojson: geoFormat,
            }),
        });

        if (response.ok) {
            const result = await response.json();

        } else {
            console.error('Error:', response.statusText);

        }
    } catch (error) {
        console.error('Error:', error.message);

    }
    geoLayer.addData(geoFormat);
    geoLayer.resetStyle();

}

/* ==========================================================================
Displaying and filtering data
========================================================================== */

//local so that the data displaying div doesn't need to be remade 
//every time you click a tile you've seen before
let loaded = {};

//dynamically create visual for tile
const grid = document.getElementById("tileLabeled");
for (let i = 0; i < 9; i++) {
    const gridItem = document.createElement("div");
    gridItem.className = "labelItem";
    gridItem.id = "labelGrid" + i;
    if (i == 4) { gridItem.classList.add("gridBox") }
    grid.appendChild(gridItem);
}
const topLeft = document.getElementById("labelGrid0");
const topRight = document.getElementById("labelGrid2");
const bottomRight = document.getElementById("labelGrid8");
const bottomLeft = document.getElementById("labelGrid6");

//showData
async function showData(properties, coords) {

    let tileData;
    try {
        const response = await fetch('/api/getTileInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                coords: coords,
            }),
        })
        tileData = await response.json();
        tileData = tileData[0]

    } catch (error) {
        console.error('Error:', error.message);
    }
    let reportData;
    try {
        const response = await fetch('/api/getReports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: tileData.id,
            }),
        })
        reportData = await response.json();


    } catch (error) {
        console.error('Error:', error.message);
    }

    tName.innerHTML = "Tile " + coords[0][1] + ", " + coords[0][0];
    //put tooltip here to explain coord title - coordinates of top left corner of tile, .00018 size

    //set coordinates for tile visual
    topLeft.innerHTML = coords[0][1] + ", " + coords[0][0];
    topRight.innerHTML = coords[1][1] + ", " + coords[1][0];
    bottomRight.innerHTML = coords[2][1] + ", " + coords[2][0];
    bottomLeft.innerHTML = coords[3][1] + ", " + coords[3][0];

    topLeft.style.textAlign = "right";
    bottomLeft.style.textAlign = "right";

    //set color for tile visual
    document.getElementById("labelGrid4").style.backgroundColor = getColorDB(tileData.avgdb) + "4d";

    //hide info + report page, show data page
    info.style.display = "none";
    report.style.display = "none";
    data.style.display = "block";

    //clear current data
    dataBlocks.innerHTML = "";

    //Create block for overall stats for tile
    const statBlock = document.createElement("div");
    statBlock.className = "data";

    const statHeader = document.createElement("h3");
    statHeader.innerHTML = "Tile Stats";
    statBlock.appendChild(statHeader);

    const reportNum = document.createElement("p");
    reportNum.innerHTML = "Number of reports: " + reportData.length;
    statBlock.appendChild(reportNum);
    const tileDB = document.createElement("p");
    if (tileData.avgdb != null) {
        tileDB.innerHTML = "Average decibel level: " + tileData.avgdb;
    } else {
        tileDB.innerHTML = "Average decibel level: N/A";
    }
    statBlock.appendChild(tileDB);
    const tileLoud = document.createElement("p");
    tileLoud.innerHTML = "Average subjective loudness (0-10): " + tileData.avgloud;
    statBlock.appendChild(tileLoud);
    statBlock.style.backgroundColor = getColorDB(tileData.avgdb) + "4d";
    dataBlocks.appendChild(statBlock);

    //go through every report and create a block for it
    for (let i = 0; i < reportData.length; i++) {

        const dataBlock = document.createElement("div");
        dataBlock.className = "data";

        const blockContent = document.createElement("div");
        blockContent.className = "blockContent";
        blockContent.id = "report" + i + "Content";

        let currentReport = reportData[i]

        const blockHeader = document.createElement("button");
        blockHeader.innerHTML = "Report #" + (i + 1) + "<span class = \"collapseIcon\" id = \"icon" + i + "\">+</span>";
        blockHeader.onclick = function () {
            toggleReport(i);
        }
        dataBlock.appendChild(blockHeader);
        blockContent.appendChild(document.createElement("br"));

        const decibelHeader = document.createElement("h4");
        decibelHeader.innerHTML = "Decibel Data";
        blockContent.appendChild(decibelHeader);

        if (currentReport.dbavg != null) {
            const avgdB = document.createElement("p");
            avgdB.innerHTML = "Average decibel level: " + currentReport.dbavg;
            blockContent.appendChild(avgdB);

            const maxdB = document.createElement("p");
            maxdB.innerHTML = "Max decibel level " + currentReport.dbmax;
            blockContent.appendChild(maxdB);

            const device = document.createElement("p");
            device.innerHTML = "Device used for measurement: " + currentReport.dbdevice;
            blockContent.appendChild(device);

            //set block color to tile color
            dataBlock.style.backgroundColor = getColorDB(currentReport.dbavg) + "4d";
        }
        else {
            const noDB = document.createElement("p");
            noDB.innerHTML = "No decibel data";
            blockContent.appendChild(noDB);

            //set block color to tile color
            dataBlock.style.backgroundColor = getColorDB(null) + "4d";
        }
        blockContent.appendChild(document.createElement("br"));

        const timeHeader = document.createElement("h4");
        timeHeader.innerHTML = "Date & Time";
        blockContent.appendChild(timeHeader);
        const date = document.createElement("p");
        date.innerHTML = currentReport.date;
        blockContent.appendChild(date);
        const time = document.createElement("p");
        time.innerHTML = currentReport.time;
        blockContent.appendChild(time);
        blockContent.appendChild(document.createElement("br"));

        const subHeader = document.createElement("h4");
        subHeader.innerHTML = "Subjective Data";
        blockContent.appendChild(subHeader);
        const loud = document.createElement("p");
        loud.innerHTML = "Loudness on scale from 0 to 10: " + currentReport.loudness;
        blockContent.appendChild(loud);
        const feeling = document.createElement("p");
        feeling.innerHTML = "Associated feeling: " + emojis[currentReport.feeling];
        blockContent.appendChild(feeling);
        blockContent.appendChild(document.createElement("br"));

        const tagHeader = document.createElement("h4");
        tagHeader.innerHTML = "Tags";
        blockContent.appendChild(tagHeader);
        const tags = document.createElement("p");
        tags.innerHTML = currentReport.tags[0];
        for (let j = 1; j < currentReport.tags.length; j++) {
            tags.innerHTML += ", " + currentReport.tags[j];
        }
        blockContent.appendChild(tags);
        dataBlock.appendChild(blockContent);
        dataBlocks.appendChild(dataBlock);
    }
}

//open report collapsibles 
function toggleReport(reportNum) {
    const reportBlock = document.getElementById("report" + reportNum + "Content");
    const icon = document.getElementById("icon" + reportNum);
    if (reportBlock.style.height == "fit-content") {
        reportBlock.style.height = 0;
        icon.innerHTML = "+";
    } else {
        reportBlock.style.height = "fit-content";
        icon.innerHTML = "-";
    }
}