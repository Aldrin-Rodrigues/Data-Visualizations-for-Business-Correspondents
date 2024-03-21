/*document.addEventListener("DOMContentLoaded", function() {
  // Load CSV data
  d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function(data) {
     // Preprocess data
     data.forEach(function(d) {
       d.Crop = d.Crop.toLowerCase().trim();
       d.Season = d.Season.toLowerCase().trim();
       d.Area = +d.Area;
       d.Production = +d.Production;
     });
 
     // Event Listener for form submission
     d3.select("#filters").on("submit", function(event) {
       event.preventDefault(); // Prevent default form submission behavior
 
       const crop = d3.select("#crop").node().value.trim().toLowerCase();
       const season = d3.select("#season").node().value.trim().toLowerCase();
       const areaInput = d3.select("#areaCheckbox").node().checked;
       const productionInput = d3.select("#productionCheckbox").node().checked;
 
       // Perform filtering
       let filteredData = data.filter((d) => {
         if (crop && season) {
           return d.Crop.toLowerCase().trim() === crop && d.Season.toLowerCase().trim() === season;
         } else if (crop) {
           return d.Crop.toLowerCase().trim() === crop;
         } else if (season) {
           return d.Season.toLowerCase().trim() === season;
         } else {
           // If neither crop nor season is provided, include all data
           return true;
         }
       });
 
       // Update bar chart
       updateBarChart(filteredData, areaInput, productionInput);
     });
  });
 });
 
 function updateBarChart(data, areaInput, productionInput) {
  // Remove existing bar chart elements
  d3.select("#bar-chart-container").selectAll("*").remove();
 
  // Create SVG container
  const svg = d3.select("#bar-chart-container")
                 .append("svg")
                 .attr("width", 800)
                 .attr("height", 600);
 
  // Define margins
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
 
  // Define scales
  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);
 
  // Define axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);
 
  // Set the domains
  x.domain(data.map(d => d.District_Name));
  y.domain([0, d3.max(data, d => areaInput ? d.Area : d.Production)]);
 
  // Append the SVG group
  const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);
 
  // Append the x-axis
  g.append("g")
     .attr("class", "x axis")
     .attr("transform", `translate(0,${height})`)
     .call(xAxis);
 
  // Append the y-axis
  g.append("g")
     .attr("class", "y axis")
     .call(yAxis)
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
     .text(areaInput ? "Area" : "Production");
 
  // Append the bars
  g.selectAll(".bar")
     .data(data)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", d => x(d.District_Name))
     .attr("width", x.bandwidth())
     .attr("y", d => y(areaInput ? d.Area : d.Production))
     .attr("height", d => height - y(areaInput ? d.Area : d.Production));
 }
 */

////////////////////////////////////////////////////////////////
/*
 d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function(data) {
  // Preprocess data
  data.forEach(function(d) {
     d.Crop = d.Crop.toLowerCase().trim();
     d.Season = d.Season.toLowerCase().trim();
     d.Area = +d.Area;
     d.Production = +d.Production;
  });
 
  // Event Listener for form submission
  d3.select("#filters").on("submit", function(event) {
     event.preventDefault(); // Prevent default form submission behavior
 
     const crop = d3.select("#crop").node().value.trim().toLowerCase();
     const season = d3.select("#season").node().value.trim().toLowerCase();
     const areaInput = d3.select("#areaCheckbox").node().checked;
     const productionInput = d3.select("#productionCheckbox").node().checked;
 
     // Perform filtering
     let filteredData = data.filter((d) => {
       if (crop && season) {
         return d.Crop.toLowerCase().trim() === crop && d.Season.toLowerCase().trim() === season;
       } else if (crop) {
         return d.Crop.toLowerCase().trim() === crop;
       } else if (season) {
         return d.Season.toLowerCase().trim() === season;
       } else {
         // If neither crop nor season is provided, include all data
         return true;
       }
     });
 
     // Update bar chart
     updateBarChart(filteredData, areaInput, productionInput);
  });
 });
 
 function updateBarChart(data, areaInput, productionInput) {
  // Remove existing bar chart elements
  d3.select("#bar-chart-container").selectAll("*").remove();
 
  // Create SVG container
  const svg = d3.select("#bar-chart-container")
                  .append("svg")
                  .attr("width", 800)
                  .attr("height", 600);
 
  // Define margins
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
 
  // Define scales
  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);
 
  // Define axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);
 
  // Set the domains
  x.domain(data.map(d => d.District_Name));
  y.domain([0, d3.max(data, d => areaInput ? d.Area : d.Production)]);
 
  // Append the SVG group
  const g = svg.append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
 
  // Append the x-axis
  //g.append("g")
    //   .attr("class", "x axis")
      // .attr("transform", `translate(0,${height})`)
       //.call(xAxis);
 
  // Append the y-axis
  g.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", "0.71em")
       .attr("text-anchor", "end")
       .text(areaInput ? "Area" : "Production");
 
  // Create a tooltip div
 // Create a tooltip div outside of the updateBarChart function
const tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Inside the updateBarChart function, use the tooltip for mouseover events
g.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", d => x(d.District_Name))
.attr("width", x.bandwidth())
.attr("y", d => y(areaInput ? d.Area : d.Production))
.attr("height", d => height - y(areaInput ? d.Area : d.Production))
.attr("fill", "#0047AB") // Set the fill color to blue
.on("mouseover", function(event, d) {
tooltip.transition()
.duration(200)
.style("opacity", .9);
tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
.style("left", (event.pageX) + "px")
.style("top", (event.pageY - 28) + "px");
})
.on("mousemove", function(event, d) {
tooltip.style("left", (event.pageX) + "px")
.style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function(d) {
tooltip.transition()
.duration(500) // Corrected duration to 500ms for a smoother transition
.style("opacity", 0); // Corrected opacity to 0 for hiding the tooltip
});

  // Append the bars
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.District_Name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(areaInput ? d.Area : d.Production))
    .attr("height", d => height - y(areaInput ? d.Area : d.Production))
    .on("mouseover", function(event, d) {
       tooltip.transition()
              .duration(200)
              .style("opacity", .9);
       tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function(event, d) {
       tooltip.style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
       tooltip.transition()
              .duration(50)
              .style("opacity", 10);
    });
 }
 */
//////////////////////////////////FINALLLLLLLLLLLLLLLLLLLLISSSS BELOWWWWWWWWWWWWWWWWWWWWWW
/*
 d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function(data) {
  // Preprocess data
  data.forEach(function(d) {
     d.Crop = d.Crop.toLowerCase().trim();
     d.Season = d.Season.toLowerCase().trim();
     d.Area = +d.Area;
     d.Production = +d.Production;
  });
 
  // Event Listener for form submission
  d3.select("#filters").on("submit", function(event) {
     event.preventDefault(); // Prevent default form submission behavior
 
     const crop = d3.select("#crop").node().value.trim().toLowerCase();
     const season = d3.select("#season").node().value.trim().toLowerCase();
     const areaInput = d3.select("#areaCheckbox").node().checked;
     const productionInput = d3.select("#productionCheckbox").node().checked;
 
     // Perform filtering
     let filteredData = data.filter((d) => {
       if (crop && season) {
         return d.Crop.toLowerCase().trim() === crop && d.Season.toLowerCase().trim() === season;
       } else if (crop) {
         return d.Crop.toLowerCase().trim() === crop;
       } else if (season) {
         return d.Season.toLowerCase().trim() === season;
       } else {
         // If neither crop nor season is provided, include all data
         return true;
       }
     });
 
     // Update bar chart
     updateBarChart(filteredData, areaInput, productionInput);
  });
 });
 
 function updateBarChart(data, areaInput, productionInput) {
  // Remove existing bar chart elements
  d3.select("#bar-chart-container").selectAll("*").remove();
 
  // Create SVG container
  const svg = d3.select("#bar-chart-container")
                  .append("svg")
                  .attr("width", 800)
                  .attr("height", 600);
 
  // Define margins
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
 
  // Define scales
  const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);
 
  // Define axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);
 
  // Set the domains
  x.domain(data.map(d => d.District_Name));
  y.domain([0, d3.max(data, d => areaInput ? d.Area : d.Production)]);
 
  // Append the SVG group
  const g = svg.append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
 
  // Append the x-axis
  //g.append("g")
    //   .attr("class", "x axis")
      // .attr("transform", `translate(0,${height})`)
       //.call(xAxis);
       g.append("g")
       .attr("class", "x axis")
       .text("Crops");
  // Append the y-axis
  g.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", "0.71em")
       .attr("text-anchor", "end")
       .text(areaInput ? "Area" : "Production");
 
  // Create a tooltip div
 // Create a tooltip div outside of the updateBarChart function
const tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Inside the updateBarChart function, use the tooltip for mouseover events
g.selectAll(".bar")
.data(data)
.enter().append("rect")
.attr("class", "bar")
.attr("x", d => x(d.District_Name))
.attr("width", x.bandwidth())
.attr("y", d => y(areaInput ? d.Area : d.Production))
.attr("height", d => height - y(areaInput ? d.Area : d.Production))
.attr("fill", "#0047AB") // Set the fill color to blue
.on("mouseover", function(event, d) {
tooltip.transition()
.duration(200)
.style("opacity", .9);
tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
.style("left", (event.pageX) + "px")
.style("top", (event.pageY - 28) + "px");
})
.on("mousemove", function(event, d) {
tooltip.style("left", (event.pageX) + "px")
.style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function(d) {
tooltip.transition()
.duration(500) // Corrected duration to 500ms for a smoother transition
.style("opacity", 0); // Corrected opacity to 0 for hiding the tooltip
});

  // Append the bars
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.District_Name))
    .attr("width", x.bandwidth())
    .attr("y", d => y(areaInput ? d.Area : d.Production))
    .attr("height", d => height - y(areaInput ? d.Area : d.Production))
    .on("mouseover", function(event, d) {
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
  })
  
  .on("mousemove", function(event, d) {
    tooltip.style("left", (event.pageX + 50) + "px")
           .style("top", (event.pageY - 28) + "px");
})

    .on("mouseout", function(d) {
      tooltip.transition()
          .duration(500) // Corrected duration to 500ms for a smoother transition
          .style("opacity", 0); // Corrected opacity to 0 for hiding the tooltip
  });
  
 }
 */
//////////////////////////////////////////COMPAREEE 2 CROPSSSSSSSSSSSSSSSSSSSSSS



d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function(data) {
  // Preprocess data
  data.forEach(function(d) {
      d.Crop = d.Crop.toLowerCase().trim();
      d.Season = d.Season.toLowerCase().trim();
      d.Area = +d.Area;
      d.Production = +d.Production;
  });

  // Event Listener for form submission
  d3.select("#filters").on("submit", function(event) {
      event.preventDefault(); // Prevent default form submission behavior

      const crop1 = d3.select("#crop1").node().value.trim().toLowerCase();
      const crop2 = d3.select("#crop2").node().value.trim().toLowerCase();
      const season = d3.select("#season").node().value.trim().toLowerCase();
      const areaInput = d3.select("#areaCheckbox").node().checked;
      const productionInput = d3.select("#productionCheckbox").node().checked;

      // Perform filtering
      let filteredData = data.filter((d) => {
          if (crop1 && crop2 && season) {
              return (d.Crop.toLowerCase().trim() === crop1 || d.Crop.toLowerCase().trim() === crop2) && d.Season.toLowerCase().trim() === season;
          } else if (crop1 && crop2) {
              return d.Crop.toLowerCase().trim() === crop1 || d.Crop.toLowerCase().trim() === crop2;
          } else if (crop1 && season) {
              return d.Crop.toLowerCase().trim() === crop1 && d.Season.toLowerCase().trim() === season;
          } else if (crop2 && season) {
              return d.Crop.toLowerCase().trim() === crop2 && d.Season.toLowerCase().trim() === season;
          } else if (crop1) {
              return d.Crop.toLowerCase().trim() === crop1;
          } else if (crop2) {
              return d.Crop.toLowerCase().trim() === crop2;
          } else if (season) {
              return d.Season.toLowerCase().trim() === season;
          } else {
              // If neither crop nor season is provided, include all data
              return true;
          }
      });

      // Update bar chart
      updateBarChart(filteredData, areaInput, productionInput, crop1, crop2);
  });
});

function updateBarChart(data, areaInput, productionInput, crop1, crop2) {
  // Remove existing bar chart elements
  d3.select("#bar-chart-container").selectAll("*").remove();

  // Create SVG container
  const svg = d3.select("#bar-chart-container")
                  .append("svg")
                  .attr("width", 800)
                  .attr("height", 600);

  // Define margins
  const margin = { top: 30, right: 90, bottom: 90, left: 30 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  // Define scales
  const x = d3.scaleBand()
  .domain(data.map(d => d.District_Name)).rangeRound([0, width]).padding(0.1);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  // Define axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Set the domains
  x.domain(data.map(d => d.District_Name));
  y.domain([0, d3.max(data, d => areaInput ? d.Area : d.Production)]);

  // Append the SVG group
  const g = svg.append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

  // Append the x-axis
  //g.append("g")
     // .attr("class", "x axis")
      //.attr("transform", `translate(0,${height})`)
      //.call(xAxis);

  // Append the y-axis
  g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(areaInput ? "Area" : "Production");

  // Create a tooltip div
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // Append the bars
  g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.District_Name))
      .attr("width", x.bandwidth())
      .attr("y", d => y(areaInput ? d.Area : d.Production))
      .attr("height", d => height - y(areaInput ? d.Area : d.Production))
      .attr("fill", d => d.Crop === crop1 ? "#0047AB" : "#FF7F00") // Set different colors for each crop
      .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event, d) {
          tooltip.style("left", (event.pageX + 50) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500) // Corrected duration to 500ms for a smoother transition
              .style("opacity", 0); // Corrected opacity to 0 for hiding the tooltip
      });
}

//////////////////////////////////
/*
d3.csv("/static/data/DistrictCropSeasonAreaProduction.csv").then(function(data) {
  // Preprocess data
  data.forEach(function(d) {
      d.Crop = d.Crop.toLowerCase().trim();
      d.Season = d.Season.toLowerCase().trim();
      d.Area = +d.Area;
      d.Production = +d.Production;
  });

  // Event Listener for form submission
  d3.select("#filters").on("submit", function(event) {
      event.preventDefault(); // Prevent default form submission behavior

      const crop1 = d3.select("#crop1").node().value.trim().toLowerCase();
      const crop2 = d3.select("#crop2").node().value.trim().toLowerCase();
      const season = d3.select("#season").node().value.trim().toLowerCase();
      const areaInput = d3.select("#areaCheckbox").node().checked;
      const productionInput = d3.select("#productionCheckbox").node().checked;

      // Perform filtering
      let filteredData = data.filter((d) => {
          if (crop1 && crop2 && season) {
              return (d.Crop.toLowerCase().trim() === crop1 || d.Crop.toLowerCase().trim() === crop2) && d.Season.toLowerCase().trim() === season;
          } else if (crop1 && crop2) {
              return d.Crop.toLowerCase().trim() === crop1 || d.Crop.toLowerCase().trim() === crop2;
          } else if (crop1 && season) {
              return d.Crop.toLowerCase().trim() === crop1 && d.Season.toLowerCase().trim() === season;
          } else if (crop2 && season) {
              return d.Crop.toLowerCase().trim() === crop2 && d.Season.toLowerCase().trim() === season;
          } else if (crop1) {
              return d.Crop.toLowerCase().trim() === crop1;
          } else if (crop2) {
              return d.Crop.toLowerCase().trim() === crop2;
          } else if (season) {
              return d.Season.toLowerCase().trim() === season;
          } else {
              // If neither crop nor season is provided, include all data
              return true;
          }
      });

      // Update bar chart
      updateBarChart(filteredData, areaInput, productionInput, crop1, crop2);
  });
});

function updateBarChart(data, areaInput, productionInput, crop1, crop2) {
  // Remove existing bar chart elements
  d3.select("#bar-chart-container").selectAll("*").remove();

  // Create SVG container
  const svg = d3.select("#bar-chart-container")
                  .append("svg")
                  .attr("width", 800)
                  .attr("height", 600);

  // Define margins
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;

  // Define scales
  const x = d3.scaleBand().rangeRound([0, width]).padding(0.2);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  // Define axis
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Set the domains
  x.domain(data.map(d => d.District_Name));
  y.domain([0, d3.max(data, d => areaInput ? d.Area : d.Production)]);

  // Append the SVG group
  const g = svg.append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

  // Append the x-axis
  //g.append("g")
     // .attr("class", "x axis")
      //.attr("transform", `translate(0,${height})`)
      //.call(xAxis);

  // Append the y-axis
  g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(areaInput ? "Area" : "Production");

  // Create a tooltip div
  const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
      const desiredBarWidth = 50;
  // Append the bars
  g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.District_Name))
      .attr("width", x.bandwidth())
      .attr("y", d => y(areaInput ? d.Area : d.Production))
      .attr("height", d => height - y(areaInput ? d.Area : d.Production))
      .attr("fill", d => d.Crop === crop1 ? "#0047AB" : "#FF7F00") // Set different colors for each crop
      .on("mouseover", function(event, d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`District: ${d.District_Name}<br>${areaInput ? "Area" : "Production"}: ${areaInput ? d.Area : d.Production}`)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event, d) {
          tooltip.style("left", (event.pageX + 50) + "px")
                 .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500) // Corrected duration to 500ms for a smoother transition
              .style("opacity", 0); // Corrected opacity to 0 for hiding the tooltip
      });
}
*/