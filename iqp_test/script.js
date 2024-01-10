var map = L.map('map').setView([18.4518, -66.0597], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


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