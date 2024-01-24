
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
        var rect = L.rectangle([[lat1-gridSize*(i), long1+gridSize*(j)],[lat1-gridSize*(i+1), long1+gridSize*(j+1)]], {
            color: "#000000",
            opacity: 0.1,
            fillColor: "#3388ff",
            fillOpacity: 0.3,
            weight: 1,
            }).addTo(map);
        rect.bindPopup("Grid tile r" + i + "c" + j);
    }
}

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

//GRIDLAYER - old method, switching to grid of polgons but keeping this here in case
/*
L.GridLayer.LocGrid = L.GridLayer.extend({
    createTile: function (coords) {
        var tile = document.createElement('div');
        //tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
        tile.style.border = '1px solid #00000022';
        //tile.style.backgroundColor = '#ff00004a';
        tile.style.boxSizing = "border-box"
        tile.style.padding = "5px"
        //tile.width = size.x;
        //tile.height = size.y;
        return tile;
    },
    options: {
		tileSize: 64,
    }
});

L.gridLayer.locGrid = function(opts) {
    return new L.GridLayer.LocGrid(opts);
};

map.addLayer( L.gridLayer.locGrid() );
*/


// INPUT STUFF

var slider = document.getElementById("perception");
var output = document.getElementById("perception-num");
output.innerHTML = slider.value; 
slider.oninput = function() {
    output.innerHTML = this.value;
}

var back = document.getElementById("back");
var info = document.getElementById("map-info");
var report = document.getElementById("map-report");
var reportbtn = document.getElementById("reportBtn");
back.onclick = function() {
    info.style.display = "block";
    report.style.display = "none";
}
reportbtn.onclick = function() {
    info.style.display = "none";
    report.style.display = "block";
}