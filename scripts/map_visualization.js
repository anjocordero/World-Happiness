var map = L.map('map').setView([37.8, -96], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXNjb3JkZXJvIiwiYSI6ImNqdDM5a2s4NTBxZW80NGx2enUwdHpra3AifQ.jl5y5TMMvmWFFsNoDc1dpg', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

var geojson;

geojson = L.geoJson(statesData).addTo(map);

var tooltip = d3.select("body").append("div") 
.attr("class", "tooltip")       
.style("opacity", 0);
