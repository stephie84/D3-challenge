
var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .style('border','2px solid black')
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age"; 
var chosenYAxis = "smokes";

//function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  //  create scales
   var xLinearScale = d3.scaleLinear()
  // .domain([d3.max(data, d => d.age)])
   //   .range([0, width]);

     .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
              d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  
  return xLinearScale;
  
 };

function yScale(data, chosenYAxis) {
  //  create scales
   var yLinearScale = d3.scaleLinear()
     .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
              d3.max(data, d => d[chosenYAxis]) * 1.2
  ]).range([0,height]);
  
  return yLinearScale;
  
 }

  // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

// parse data
censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes

  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);


  // Create y scale function
  var yLinearScale = yScale(censusData, chosenYAxis);
  

  // Create initial axis functions
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // append y axis
  chartGroup.append("g")
    .classed('y-axis', true)
    .attr('transform',`translate(0,${margin.top})`)
    .call(yAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle").data(censusData).enter();

circlesGroup
.append("circle")
.attr("cx", d => xLinearScale(d[chosenXAxis]))
.attr("cy", d => yLinearScale(d[chosenYAxis]))
.attr('class','stateCircle')
.attr("r", 20)
.attr("fill", "lightblue")


 circlesGroup
 .append("text")
 .text(d => d.abbr)
 .attr("dx", d => xLinearScale(d[chosenXAxis]))
 .attr("dy", d => yLinearScale(d[chosenYAxis]) + 20/2.5)
 .attr('class', 'stateText')

});
// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Smokes");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("Age");


//});