// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var PlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

function ColorSelector (Depth)
{ var Color="";
if (Depth<10) Color="lightgreen";
else if (Depth<30) Color="yellow";
else if (Depth<50) Color="gold";
else if (Depth<70) Color="darkorange";
else if (Depth<90) Color="red";
else Color="darkred";
// console.log(Depth);
return (Color);
}


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

var Plates = new L.layerGroup();
      d3.json(PlatesURL, function(response) {
          
      L.geoJSON(response, {
        style:  {weight: 2,
        color: "orange"}
      }).addTo(Plates);
      // faults.addTo(map)
    });

  // Once we get a response, send the data.features object to the createFeatures function
  var cityCircles_layer=createFeatures(data.features);
  // Sending our earthquakes layer to the createMap function
  createMap(cityCircles_layer, Plates);


});

function createFeatures(earthquakeData) {

  var cityCircles = [];
  for (var i = 0; i < earthquakeData.length; i++) {

     // Set the data location property to a variable
   var location = earthquakeData[i].geometry;
 
  //  console.log(earthquakeData);
     // Set the Earthquake magnitudes property to a variable
     var magnitudes = earthquakeData[i].properties.mag;
 
    // Set the Earthquake Depth property to a variable
     var Depth=location.coordinates[2];
 
 // Check for location property
 
     if (location) {


       // Add a circle markers to the map and bind a pop-up
       cityCircles.push(L.circleMarker([location.coordinates[1], location.coordinates[0]],
         {"radius":magnitudes*3,
           "fillColor": ColorSelector(Depth),
           "fillOpacity": 1,
           "color": "black",
           "weight": 0.5,
           "opacity": 1
         })
         .bindPopup(earthquakeData[i].properties.place+
          "<hr>Time = "+ (new Date(earthquakeData[i].properties.time)).toLocaleString()+
          "<br>Magnitudes = "+magnitudes+
          "<br>Depth = "+Depth)       );

     }
    console.log(location.coordinates[0],location.coordinates[1],location.coordinates[2]);

}
return L.layerGroup(cityCircles)

}

function createMap(cityCircles_layer,Plates) {

  console.log(cityCircles_layer);

  // Define The Maps layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light MAp":lightMap,
    "satellite Map":satMap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": cityCircles_layer,
    "Tectonic Plates": Plates
  };

  // Create our map, giving it the satellite Map and earthquakes layers to display on load
  var myMap = L.map("map", {
    center:  [36.7783, -119.4179],
    zoom: 3,
    layers: [satMap, cityCircles_layer]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Set up the legend
var legend = L.control({ position: "bottomright" });
  
legend.onAdd = function() { var div = L.DomUtil.create('div', 'info legend')
      
div.innerHTML = "<table style= 'background-color: white'><tr><td colspan='2' ><h3>&nbsp;&nbsp;Depth </h3></td></tr>"+
                "<tr><td><10</td><td style= 'background-color: lightgreen'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>"+
                "<tr><td>10-30</td><td style= 'background-color: yellow'></td></tr>"+
                "<tr><td>30-50</td><td style= 'background-color: gold'></td></tr>"+
                "<tr><td>50-70</td><td style= 'background-color: darkorange'></td></tr>"+
                "<tr><td>70-90</td><td style= 'background-color: Red'></td></tr>"+
                "<tr><td>>90</td><td style= 'background-color: darkred'></td></tr>"+
                "</table>";

return div;
};

legend.addTo(myMap);




}
