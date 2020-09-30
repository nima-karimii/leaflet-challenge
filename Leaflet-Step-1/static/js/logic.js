// Creating map object
var myMap = L.map("map", {
  center: [36.7783, -119.4179],
  zoom: 7
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Color selector Function
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

// Grab the data with d3
d3.json(URL, function(response) {

  console.log(response)

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

   // Set the data Feature property to a variable
    var Feature = response.features[i];

    // Set the data location property to a variable
  var location = Feature.geometry;

    // Set the Earthquake magnitudes property to a variable
    var magnitudes = Feature.properties.mag;

   // Set the Earthquake Depth property to a variable
    var Depth=location.coordinates[2];

// Check for location property

    if (location) {

      // Add a circle markers to the map and bind a pop-up
      L.circleMarker([location.coordinates[1], location.coordinates[0]],
        {"radius":magnitudes*5,
          "fillColor": ColorSelector(Depth),
          "fillOpacity": 1,
          "color": "black",
          "weight": 0.5,
          "opacity": 1
        })
        .bindPopup(response.features[i].properties.place+
                  "<hr>Time = "+ (new Date(Feature.properties.time)).toLocaleString()+
                  "<br>Magnitudes = "+magnitudes+
                  "<br>Depth = "+Depth)
        .addTo(myMap)
    }

  }
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

});
