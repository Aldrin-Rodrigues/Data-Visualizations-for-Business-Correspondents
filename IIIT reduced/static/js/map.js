document.addEventListener("DOMContentLoaded", function() {
  const mapContainer = d3.select("#map-container");
const width = 800
const height = 800;
let geojsonData;
let path;

// //Projection for the map
// const projection = d3
//   .geoMercator()
//   .scale(1000)
//   .center([81, 23])
//   .translate([width / 2, height / 2]);

// //Path generator
// const path = d3.geoPath().projection(projection);

// console.log("Path:", path);

//Load geojson data
// Load GeoJSON data
d3.json("/static/data/india_district.geojson").then(function(geojson) {

  geojsonData=geojson;
  const projection = d3.geoMercator().fitSize([width, height], geojsonData);
  path = d3.geoPath().projection(projection);

  // Create SVG container
  const svg = d3.select("#map-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  // Define stroke width for states and districts
  const stateStrokeWidth = 2;
  const districtStrokeWidth = 0.5;

  // Draw map features
  svg.selectAll("path")
     .data(geojson.features)
     .enter()
     .append("path")
     .attr("d", path)
     .attr("fill", "white")
     .attr("stroke", d => {
         // Check the type of feature (state or district)
         return d.properties.TYPE_2 === "State" ? "black" : "black";
     })
     .attr("stroke-width", d => {
         // Set stroke width based on feature type
         return d.properties.TYPE_2 === "State" ? stateStrokeWidth : districtStrokeWidth;
     });
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

function addLegend(colorScale) {
  // Remove existing legend if any
  d3.select("#legend-container").remove();
  // Create a new legend container
  const legendContainer = d3.select(".formdiv").append("div").attr("id", "legend-container");

  const legendTitle = legendContainer.append("h3")
  .text("Legend")
  .style("margin-top", "20px");
  const legend = legendContainer.append("svg").attr("width", 100).attr("height", 100);
  const legendWidth = 20;
  const legendHeight = 20;
  const legendPadding = 5;
  const legendItems = legend
      .selectAll("g")
      .data(colorScale.ticks(5))
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * (legendHeight + legendPadding)})`);
  legendItems
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", colorScale);
  legendItems
      .append("text")
      .text((d) => d)
      .attr("x", legendWidth + 5)
      .attr("y", legendHeight / 2)
      .attr("dy", "0.35em");
}


function updateMap(geojson,filteredData, areaInput, productionInput) {
  //remove existing map elements
  d3.select("#map-container").select("svg").remove();

  //Render map
  const svg = mapContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "lightgray")
    .attr("stroke", "black");


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
        return "white";
      }
    })
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .on("mouseover", function (event, d) {
      event.stopPropagation();
      const districtName = event.target.__data__.properties.NAME_2;
      const stateName = event.target.__data__.properties.NAME_1;
      d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      console.log("event", event);
      console.log("d", d);
          d3.select("#map-container")
          .append("div")
          .attr("class", "popup")
          .html(`<strong>District: ${districtName}<br><strong>State:</strong> ${stateName}`) // Display "Hello" text
          .style("left", event.pageX + "px") // Set popup position
          .style("top", event.pageY + "px");
    })
    .on("mouseleave", function (d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 0.5);
      d3.select(".popup").remove();
      });

    
    //Add legend
      addLegend(colorScale);
}


//Event Listener for form submission
d3.select("#filters").on("submit", function (event) {
  console.log("Form Submitted");
  event.preventDefault(); // Prevent default form submission behavior

  const crop = d3.select("#crop").node().value.trim().toLowerCase();
  const season = d3.select("#season").node().value.trim().toLowerCase();
  const areaInput = d3.select("#areaCheckbox").node().checked;
  const productionInput = d3.select("#productionCheckbox").node().checked;

  console.log("Crop:", crop);
  console.log("Season:", season);
  console.log("Area Input:", areaInput);

  // Perform filtering
  // let filteredData = data.filter((d) => 
  //     d.Crop.toLowerCase().trim() === crop && 
  //     d.Season.toLowerCase().trim() === season
  // );

  let filteredData = data.filter((d) => {
    if (crop && season) {
        return d.Crop.toLowerCase().trim() === crop && 
               d.Season.toLowerCase().trim() === season;
    } else if (crop) {
        return d.Crop.toLowerCase().trim() === crop;
    } else if (season) {
        return d.Season.toLowerCase().trim() === season;
    } else {
        // If neither crop nor season is provided, include all data
        return true;
    }
});




  console.log("Filtered Data:", filteredData);
  updateMap(geojsonData, filteredData, areaInput, productionInput);


});
});


});

