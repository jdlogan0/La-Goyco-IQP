//hi!

/* ==========================================================================
General map setup
========================================================================== */

//size of grid tiles
let gridSize = .00018;

let map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 16,
    maxBoundsViscosity: 1.0,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//bounds of map
let bounds = [[18.454596, -66.066049],[18.447085, -66.050838]]
map.fitBounds(bounds);
map.setMaxBounds(bounds);

// polygon for monitoring area
let goyco = L.polygon(
    [
        [18.454494, -66.063388],
        [18.45427, -66.061994],
        [18.454026, -66.061672],
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
    
    ], 
    {
        color: 'blue',
        fill: false
    }
    ).addTo(map);


/* ==========================================================================
GeoJSON Stuff
Worth noting GeoJSON goes [long, lat] unlike Leaflet's [lat, long]
geojson var from geojson.js for organization purposes
========================================================================== */

//add GeoJSON Layer
let geoLayer = L.geoJSON(geojson, {
    style: function(feature) {
            let thisStyle = {
                color: "white",
                weight: 2,
                fillOpacity: 0.4,
                stroke: false,
                fillColor: "#ff0000"
            };

            //assign color based on average dB for tile
            let dB = feature.properties.avgdB;
            if (dB < 10) {thisStyle.fillColor = "#48f702";}
            else if (dB < 10) {thisStyle.fillColor = "#69f702";}
            else if (dB < 30) {thisStyle.fillColor = "#89f702";}
            else if (dB < 40) {thisStyle.fillColor = "#a6f702";}
            else if (dB < 50) {thisStyle.fillColor = "#b6f702";}
            else if (dB < 60) {thisStyle.fillColor = "#caf702";}
            else if (dB < 70) {thisStyle.fillColor = "#e7f702";}
            else if (dB < 80) {thisStyle.fillColor = "#f7ef02";}
            else if (dB < 90) {thisStyle.fillColor = "#f7c602";}
            else if (dB < 100) {thisStyle.fillColor = "#f79902";}
            else if (dB < 110) {thisStyle.fillColor = "#f77d02";}
            else if (dB < 130) {thisStyle.fillColor = "#f76002";}
            else if (dB < 140) {thisStyle.fillColor = "#f73802";}
            else {thisStyle.color = "#f70202";};
            return thisStyle;
        },
    onEachFeature: function onEachFeature(feature, layer) {

        //white outline with hover
        layer.on("mouseover",function(e) {
            layer.setStyle({
                    stroke: true,
                  });
            });

        //no outline when mouse leaves
        layer.on("mouseout",function(e) {
            layer.setStyle({
                    stroke: false,
                  });
            });
        
        //show data if clicked
        layer.on("click",function(e) {
            showData(feature.properties);
        });
    }

}).addTo(map);

/*
//for testing
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}
map.on('click', onMapClick);
*/


/* ==========================================================================
Input for adding data to the map
========================================================================== */

const backData = document.getElementById("back-data");
const backReport = document.getElementById("back-report");
const info = document.getElementById("map-info");
const report = document.getElementById("map-report");
const data = document.getElementById("map-data");
const dataBlocks = document.getElementById("dataBlocks");
const tName = document.getElementById("tile-name");
const reportbtn = document.getElementById("reportBtn");
backData.onclick = function() {
    info.style.display = "block";
    data.style.display = "none";
}
backReport.onclick = function() {
    info.style.display = "block";
    report.style.display = "none";
}

reportbtn.onclick = function() {
    info.style.display = "none";
    data.style.display = "none";
    report.style.display = "block";
}

const loudDesc = ["No noise at all","1 desc","2 desc","3 desc","4 desc","pleasant i guess?", "6 desc", "7 desc", "8 desc", "9 desc", "Sitting next to a jet taking off"];
const loudRange = document.getElementById("perception");
const loudTxt = document.getElementById("loudTxt");
let loudCurrent = document.getElementById("perception-num");
loudCurrent.innerHTML = loudRange.value; 
loudRange.oninput = function(e) {
    loudTxt.innerHTML = loudDesc[e.target.value];
    loudCurrent.innerHTML = this.value;
  };


const emojis = ['😀','🙂','😐','🙁','😢'];
const feelingRange = document.getElementById("feeling");
const emoji = document.getElementById("emoji");
feelingRange.oninput = function(e) {
    emoji.innerHTML = emojis[e.target.value];
  };


//tag stuff
function hideTags() {
    document.getElementById("tagSearch").value = "";
    document.getElementById("tag-dropdown").style.display = "none";
}
  
function filterTags() {
    let input = document.getElementById("tagSearch");
    let filter = input.value.toUpperCase();
    let dropdown = document.getElementById("tag-dropdown");
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

function addTag(tag) {
    
}

/* ==========================================================================
Displaying and filtering data
========================================================================== */

//showData
function showData(properties) {
    tName.innerHTML = "Title??? Position??? ";
    info.style.display = "none";
    report.style.display = "none";
    data.style.display = "block";

    dataBlocks.innerHTML = "";

    const statBlock = document.createElement("div");
    statBlock.className = "data";
    const statHeader = document.createElement("h3");
    statHeader.innerHTML = "Overall Stats";
    statBlock.appendChild(statHeader);
    const reportNum = document.createElement("p");
    reportNum.innerHTML = "Number of reports: " + properties.dataNum;
    statBlock.appendChild(reportNum);
    const tileDB = document.createElement("p");
    tileDB.innerHTML = "Average decibel level: " + properties.avgdB;
    statBlock.appendChild(tileDB);
    const tileLoud = document.createElement("p");
    tileLoud.innerHTML = "Average subjective loudness (0-10): " + properties.avgLoud;
    statBlock.appendChild(tileLoud);
    dataBlocks.appendChild(statBlock);


    let dataArr = properties.data;

    for (let i = 0; i < properties.dataNum; i++) {
        const dataBlock = document.createElement("div");
        dataBlock.className = "data";

        let currentReport = dataArr[i]

        const blockHeader = document.createElement("h3");
        blockHeader.innerHTML = "Report #" + (i+1);
        dataBlock.appendChild(blockHeader);
        dataBlock.appendChild(document.createElement("br"));

        const decibelHeader = document.createElement("h4");
        decibelHeader.innerHTML = "Decibel Data";
        dataBlock.appendChild(decibelHeader);
        if (currentReport.decibel != null) {
            const avgdB = document.createElement("p");
            avgdB.innerHTML = "Average decibel level: " + currentReport.decibel.avg;
            dataBlock.appendChild(avgdB);

            const maxdB = document.createElement("p");
            maxdB.innerHTML = "Max decibel level " + currentReport.decibel.max;
            dataBlock.appendChild(maxdB);

            const device = document.createElement("p");
            device.innerHTML = "Device used for measurement: " + currentReport.decibel.device;
            dataBlock.appendChild(device);
        }
        else {
            const noDB = document.createElement("p");
            noDB.innerHTML = "No decibel data";
            dataBlock.appendChild(noDB);
        }
        dataBlock.appendChild(document.createElement("br"));

        const timeHeader = document.createElement("h4");
        timeHeader.innerHTML = "Time";
        dataBlock.appendChild(timeHeader);
        const time = document.createElement("p");
        time.innerHTML = currentReport.time;
        dataBlock.appendChild(time);
        dataBlock.appendChild(document.createElement("br"));

        const subHeader = document.createElement("h4");
        subHeader.innerHTML = "Subjective Data";
        dataBlock.appendChild(subHeader);
        const loud = document.createElement("p");
        loud.innerHTML = "Loudness on scale from 0 to 10: " + currentReport.loudness;
        dataBlock.appendChild(loud);
        const feeling = document.createElement("p");
        feeling.innerHTML = "Associated feeling: " + currentReport.feeling;
        dataBlock.appendChild(feeling);
        dataBlock.appendChild(document.createElement("br"));

        const tagHeader = document.createElement("h4");
        tagHeader.innerHTML = "Tags";
        dataBlock.appendChild(tagHeader);
        const tags = document.createElement("p");
        tags.innerHTML = currentReport.tags[0];
        for (let j = 1; j < currentReport.tags.length; j++) {
            tags.innerHTML +=  ", " + currentReport.tags[j];
        }
        dataBlock.appendChild(tags);



        dataBlocks.appendChild(dataBlock);
    }
}