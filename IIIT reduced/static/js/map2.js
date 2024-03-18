const width = 800;
const height = 800;

// Load the CSV file and geojson file
Promise.all([
  d3.csv("/static/data/cleaned_dataset3.csv"),
  d3.json("/static/data/india_district.geojson"),
])
  .then(function (data) {
    const csvData = data[0];
    const geojsonData = data[1];

    // Function to filter data based on user inputs
    function filterData(filters, csvData) {
      console.log("Filters:", filters); // Log filter values

      return csvData.filter(function (d) {
        return Object.entries(filters).some(([key, value]) => {
          console.log("Data Value:", d[key]); // Log data value for debugging
          if (typeof d[key] === "undefined") return false;
          // Convert both the data value (d[key]) and the filter value (value) to lowercase
          // Then compare them for equality
          return d[key].toLowerCase() === value.toLowerCase();
        });
      });
    }

    // Function to render the map
    function renderMap(geojsonData) {
      const projection = d3.geoMercator().fitSize([width, height], geojsonData);
      const path = d3.geoPath().projection(projection);

      // Append SVG element for the map
      const svg = d3
        .select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      // Draw map features
      svg
        .selectAll("path")
        .data(geojsonData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .style("fill", "none");
    }

    // Function to add a legend to the map
    function addLegend(colorScale) {
      // Remove existing legend if any
      d3.select("#legend-container").remove();
  
      // Create a new legend container
      const legendContainer = d3.select("#map").append("div").attr("id", "legend-container");
  
      const legendTitle = legendContainer.append("h3").text("Legend");
      const legend = legendContainer.append("svg").attr("width", 100).attr("height", 100);
      const legendWidth = 20;
      const legendHeight = 20;
      const legendPadding = 5;
  
      // Specify the number of ticks explicitly to display only whole numbers
      const ticks = Math.ceil(colorScale.domain()[1]); // Adjust the scale domain to fit your data
  
      const legendItems = legend
          .selectAll("g")
          .data(colorScale.ticks(ticks))
          .join("g")
          .attr("transform", (d, i) => `translate(0, ${i * (legendHeight + legendPadding)})`);
  
      legendItems
          .append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .attr("fill", colorScale);
  
      legendItems
          .append("text")
          .text((d) => Math.round(d)) // Round the tick values to display whole numbers
          .attr("x", legendWidth + 5)
          .attr("y", legendHeight / 2)
          .attr("dy", "0.35em");
  }
  

    // Function to update the map
    function updateMap(filters) {


      console.log("filters", filters);

      // Convert filters object to an array of filtered data
    const filteredArray = Object.values(filters);


    // Create a set of unique districts from the main CSV data
    const allDistricts = new Set(csvData.map(d => d["District "].toLowerCase()));

    // Initialize an object to store the count of unique BCs for each district
    const districtBCCounts = {};

    // Compute the count of unique BCs for each district in the filtered data
    filteredArray.forEach(d => {
        const district = d["District "].toLowerCase();
        const bc = d["Name of BC"].toLowerCase(); // Assuming "BC" is the field containing BC information

        // Initialize count for the district if not already present
        districtBCCounts[district] = districtBCCounts[district] || new Set();
        
        // Add the BC to the set for the district
        districtBCCounts[district].add(bc);
    });

    // Convert the sets of unique BCs to their lengths
    Object.keys(districtBCCounts).forEach(district => {
        districtBCCounts[district] = districtBCCounts[district].size;
    });

    // Update the counts for districts not present in the filtered data to 0
    allDistricts.forEach(district => {
        if (!(district in districtBCCounts)) {
            districtBCCounts[district] = 0;
        }
    });



      console.log("District BC Counts:", districtBCCounts);

      // Create a color scale based on the BC counts
      const colorScale = d3.scaleSequential(
        d3.extent(Object.values(districtBCCounts)),
        d3.interpolateBlues
      );

      console.log("Color Scale Domain:", colorScale.domain());
      console.log("Color Scale Range:", colorScale.range());

      // Update the map
      d3.selectAll("path") // Select all paths (districts) in the map
          .data(geojsonData.features)
          .on("mouseover", function(event,d) {
            // Append popup with "Hello" text
            const districtName = event.target.__data__.properties.NAME_2;
            const stateName = event.target.__data__.properties.NAME_1;
            console.log("event", event);
              console.log("d", d);
            d3.select("#map")
            .append("div")
            .attr("class", "popup")
            .html(`<strong>District: ${districtName}<br><strong>State:</strong> ${stateName}`) // Display "Hello" text
            .style("left", event.pageX + "px") // Set popup position
            .style("top", event.pageY + "px");
            })
          // Add mouseout event listener
          .on("mouseout", function() {
              d3.select(".popup").remove();
              
          })
      
          .style("fill", function (d) {
              const district = d.properties.NAME_2.toLowerCase(); // Get the name of the district and convert to lowercase
              const bcCount = districtBCCounts[district]; // Get the count of BCs in the district
              console.log("District:", district, "BC Count:", bcCount);
              return bcCount ? colorScale(bcCount) : "white"; // If count exists, use color scale; otherwise, use gray
        });

      
        


        addLegend(colorScale);
    }

    // Event listener for form submission
    document
      .getElementById("filterForm")
      .addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Get filter values from the form
        const filters = {
          bank: document.getElementById("bank").value.trim().toLowerCase(),
          gender: document.getElementById("gender").value.trim().toLowerCase(),
          crop: document.getElementById("crop").value.trim().toLowerCase(),
      };
      
      let filteredData = csvData.filter(
          (d) =>
              (!filters.bank || (d["Bank Name"] && d["Bank Name"].toLowerCase().trim() === filters.bank))  &&
              (!filters.gender || (d["Gender"] && d["Gender"].toLowerCase().trim() === filters.gender)) &&
              (!filters.crop || (d["CROP_NAME"] && d["CROP_NAME"].toLowerCase().trim() === filters.crop))
      );

        console.log("Filtered Data:", filteredData);
        updateMap(filteredData);

      });

    // Initial map rendering
    renderMap(geojsonData);
  })
  .catch(function (error) {
    console.log(error);
  });
