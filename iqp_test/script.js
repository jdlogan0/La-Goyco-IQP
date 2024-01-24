
//size of grid tiles
var gridSize = .00018;

//42 * 85 grid
var gridRows = 43;
var gridCols = 86;

var map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 16,
    maxBoundsViscosity: 1.0,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//bounds of monitoring area
var lat1 = 18.454677;
var lat2 = lat1 - gridRows*gridSize;
var long1 = -66.06622;
var long2 = long1 + gridCols*gridSize;
var bounds = [[lat1, long1],[lat2, long2]]

var boundRect = L.rectangle(bounds, {
    color: 'red',
    fill: false,
    }).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);



//polygon grid
for (var i = 0; i < gridRows; i++) {
    for (var j = 0; j < gridCols; j++) {
        var tileName = "r" + i + "c" + j;
        var rect = L.rectangle([[lat1-gridSize*(i), long1+gridSize*(j)],[lat1-gridSize*(i+1), long1+gridSize*(j+1)]], {
            color: "#000000",
            opacity: 0.1,
            fillColor: "#3388ff",
            fillOpacity: 0.3,
            weight: 1,
            name: tileName
            }).addTo(map);
        rect.bindPopup("Grid tile " + tileName);
        rect.on('click', function(e) {
            showData(this.options.name);
        });
        rect.on("mouseover",function(e) {
            this.setStyle({
                color: 'white',
                opacity: 1.0,
                weight: 2,
              });
        });
        rect.on("mouseout",function(e) {
            this.setStyle({
                color: '#000000',
                opacity: 0.1,
                weight: 1,
              });
          });
    }
}

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);


// INPUT STUFF

var backData = document.getElementById("back-data");
var backReport = document.getElementById("back-report");
var info = document.getElementById("map-info");
var report = document.getElementById("map-report");
var data = document.getElementById("map-data");
var tName = document.getElementById("tile-name");
var reportbtn = document.getElementById("reportBtn");
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

function showData(tile) {
    tName.innerHTML = "Grid tile " + tile;
    info.style.display = "none";
    report.style.display = "none";
    data.style.display = "block";
}

const loudDesc = ["No noise at all","1 desc","2 desc","3 desc","4 desc","pleasant i guess?", "6 desc", "7 desc", "8 desc", "9 desc", "Sitting next to a jet taking off"];
const loudRange = document.getElementById("perception");
const loudTxt = document.getElementById("loudTxt");
var loudCurrent = document.getElementById("perception-num");
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
    var input, filter, ul, li, a, i;
    var input = document.getElementById("tagSearch");
    var filter = input.value.toUpperCase();
    var dropdown = document.getElementById("tag-dropdown");
    var tags = dropdown.getElementsByTagName("button");
    var totalShown = 0;
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