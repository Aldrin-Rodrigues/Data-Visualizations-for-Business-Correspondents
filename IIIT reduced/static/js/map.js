const mapContainer = d3.select("#map-container");
const width = +mapContainer.style("width").slice(0, -2);
const height = 600;

//Projection for the map
const projection = d3
  .geoMercator()
  .scale(1000)
  .center([81, 23])
  .translate([width / 2, height / 2]);

//Path generator
const path = d3.geoPath().projection(projection);

//Load geojson data
d3.json("/static/data/india_district.geojson").then(function (geojson) {
  // const states = topojson.feature(data, data.objects.states);
  // console.log(states);
  //Create the map
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
    d.Area = +d.Area;
    d.Production = +d.Production;
  });

const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, (d) => d.Area)]); // Adjust domain based on your data

function updateMap(filteredData, areaInput, productionInput) {
    //remove existing map elements
    d3.select("svg").remove();

    //Render map
    const svg = mapContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //Add map paths
    svg
      .selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        //Find data for each feature
        const featureData = filteredData.find(
          (item) => item.District_Name === d.properties.NAME_2
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
        d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
      });
}

  //Event Listener for form submission
d3.select("#filters").on("submit", function () {
    d3.event.preventDefault(); //prevents form from submitting

    const crop = d3.select("#crop").node().value.trim();
    const season = d3.select("#season").node().value.trim();
    const areaInput = d3.select("#areaCheckbox").node().checked;
    const productionInput = d3.select("#productionCheckbox").node().checked;

    //Performs filtering
    let filteredData = data.filter((d) => d.Crop === crop && d.Season === season);

    updateMap(filteredData, areaInput, productionInput);
  });
});

