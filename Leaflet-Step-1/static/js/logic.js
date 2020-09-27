// Creating map object
var myMap = L.map("map", {
  center: [34.5199, -118.2437],
  zoom: 6
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY}).addTo(myMap);

// Store API query variables
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Color selector Function
function ColorSelector (Depth)
{
if (Depth<10) Color="lightgreen";
else if (Depth<30) Color="yellowgreen";
else if (Depth<50) Color="gold";
else if (Depth<70) Color="darkorange";
else if (Depth<90) Color="red";
else Color="darkred";
// console.log(Depth);
return (Color);
}

// Grab the data with d3
d3.json(URL, function(response) {

  // console.log(response)

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

  
  var Feature = response.features[i];
    // Set the data location property to a variable
  var location = Feature.geometry;


    // console.log([location.coordinates[1], location.coordinates[0]]);
    // Check for location property
    var Color = "";
    var magnitudes = Feature.properties.mag;
    var Depth=location.coordinates[2];


    if (location) {

      // Add a circle markers to the map and bind a pop-up
      L.circleMarker([location.coordinates[1], location.coordinates[0]],
        {"radius":magnitudes*5,
          "fillColor": ColorSelector(Depth),
          "color": "black",
          "weight": 1,
          "opacity": 1
        })
        .bindPopup(response.features[i].properties.place+"<hr>Magnitudes="+magnitudes+"<br>Depth="+Depth)
        .addTo(myMap)
    }

  }
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() { var div = L.DomUtil.create('div', 'info legend')
        
  div.innerHTML = "<table style= 'background-color: white'><tr><td><h3>Depth</h3></td></tr>"+
                  "<tr><td><10</td><td style= 'background-color: lightgreen'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>"+
                  "<tr><td>10-30</td><td style= 'background-color: yellowgreen'></td></tr>"+
                  "<tr><td>30-50</td><td style= 'background-color: gold'></td></tr>"+
                  "<tr><td>50-70</td><td style= 'background-color: darkorange'></td></tr>"+
                  "<tr><td>70-90</td><td style= 'background-color: Red'></td></tr>"+
                  "<tr><td>>90</td><td style= 'background-color: darkred'></td></tr>"+
                  "</table>";

  return div;
};

legend.addTo(myMap);

});
