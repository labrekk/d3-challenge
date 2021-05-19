// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var labelArea = 110;

var tPadX = 40;
var tPadY = 40;

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");
// -------------------------
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

svg.append("g").attr("class", "xText");

var xText = d3.select(".xText");

// Tutor recommended and walked me through how to set up xText. I'm still working to understand how it works.
// After setting up initial "poverty" xText I was able to figure out the rest but need to go back to work with this function more

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin.bottom - tPadX) +
      ")"
  );
}
xTextRefresh();

xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("poverty");


var leftTextX = margin.left + tPadY;
var leftTextY = (height + labelArea) / 2 - labelArea;

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");

function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("obesity");

d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
console.log(data)
  visualize(data);
});

function visualize(theData) {

  var curX = "poverty";
  var curY = "obesity";

  var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(theData, d => d[curX])])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(theData, d => d[curY])])
      .range([height, 0]);
// add code to change current x + y

  var circlesGroup = chartGroup.selectAll("circle")
  .data(theData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "15")
  .attr("fill", "pink")
  .attr("opacity", ".5");

  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
     
      var xVar;
      var state = "<div>" + d.state + "</div>";

      var yVar = "<div>" + curY + ": " + d[curY] + "%</div>";

      if (curX === "poverty") {

        xVar = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return state + xVar + yVar;
    });
  // Call the toolTip
  svg.call(toolTip);
}