document.addEventListener("DOMContentLoaded", function() {
  const mapContainer = d3.select("#map-container");
const width = +mapContainer.style("width").slice(0, -2);
const height = 600;
let geojsonData;

//Projection for the map
const projection = d3
.geoMercator()
.scale(1000)
.center([81, 23])
.translate([width / 2, height / 2]);

//Path generator
const path = d3.geoPath().projection(projection);

console.log("Path:", path);

//Load geojson data
d3.json("/static/data/india_district.geojson").then(function (geojson) {
// const states = topojson.feature(data, data.objects.states);
// console.log(states);
//Create the map
geojsonData=geojson;
mapContainer
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  // .append("g")
  .selectAll("path")
  .data(geojson.features)
  // .enter()
  // .append("path")
  .join("path")
  .attr("d", path)
  .attr("fill", "lightgray")
  .attr("stroke", "black");
});

d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function (
data
) {
data.forEach(function (d) {
  d.Crop = d.Crop.toLowerCase().trim(); 
  d.Season = d.Season.toLowerCase().trim();
  d.Area = +d.Area;
  d.Production = +d.Production;
});
console.log("Data:", data);

function updateMap(geojson,filteredData, areaInput, productionInput) {
  //remove existing map elements
  d3.select("svg").remove();

  //Render map
  const svg = mapContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const areaByDistrict = d3.rollup(filteredData, 
      v => d3.sum(v, d => d.Area), 
      d => d.District_Name
  );

  console.log("Area by District:", areaByDistrict);

  const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(areaByDistrict.values())]);

      console.log("Color Scale Domain:", colorScale.domain());


  //Add map paths
  svg
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) => {
      //Find data for each feature
      const featureData = filteredData.find(
          (item) => item.District_Name.toLowerCase() === d.properties.NAME_2.toLowerCase()
      );




      //Check if data exists for that feature
      if (featureData) {
        //Calculate area, production, or ratio based on user input
        if (areaInput && productionInput) {
          value = featureData.Production / featureData.Area; //Ratio
        } else if (areaInput) {
          value = featureData.Area;
        } else if (productionInput) {
          value = featureData.Production;
        }
        return colorScale(value);
      } else {
        //If no data found, return lightgray
        return "blue";
      }
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.5)
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 0.5);
    });
}

//Event Listener for form submission
d3.select("#filters").on("submit", function () {
  console.log("Form Submitted");
  d3.event.preventDefault(); //prevents form from submitting

  const crop = d3.select("#crop").node().value.trim().toLowerCase();
  const season = d3.select("#season").node().value.trim().toLowerCase();
  const areaInput = d3.select("#areaCheckbox").node().checked;
  const productionInput = d3.select("#productionCheckbox").node().checked;

  console.log("Crop:", crop);
  console.log("Season:", season);
  console.log("Area Input:", areaInput);

  //Performs filtering
  let filteredData = data.filter((d) => d.Crop === crop && d.Season === season);
  console.log("Filtered Data:", filteredData);
  updateMap(geojsonData, filteredData, areaInput, productionInput);
});
});


});

