///Learning resource material from: https://bl.ocks.org/mbostock/4062045

var url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

var width = 1000;
var height = 800;

var svg = d3.select("#forcegraph")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().distance(50).strength(1))
  .force("charge", d3.forceManyBody().strength(-60).distanceMax(150).distanceMin(30))
    .force("center", d3.forceCenter(width / 2.1, height / 2.1));

 
 d3.json(url, function(error, data) {

  if (error) throw error;

  var tooltip = d3.select("#forcegraph")
             .append("div")
             .attr("class", "tooltip")
             .style("opacity", 0);
   
 var link = svg.append("g")
    .selectAll("line")
    .data( data.links)
    .enter().append("line")
    .attr("stroke-width", "2")
    .attr('class', 'links');
   
 var nodes = d3.select("#flags").selectAll("img")
    .data( data.nodes)
    .enter()
    .append("text")
    .append("img")
    .attr("class", function(d) { return "flag flag-" + d.code; })
    .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
    .on("mouseover", function(d) {
            tooltip.transition()
                   .duration(100)
                   .style("opacity", 0.8);
            tooltip.html("<div>" + d.country + "</div>")
                   .style("left", (d3.event.pageX + 8) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", 0.8);
        });;
    
  simulation
      .nodes( data.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links( data.links);
function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   nodes.style('left', function (d) { return d.x + 'px'; })
             .style('top', function (d) { return d.y + 'px'; })
  }
});


svg.append("text")
    .attr("x", 50)
    .attr("y", 80)
    .attr('id', 'title')
    .style('fill', 'steelblue')
    .attr("class", "heading")
    .text("Countries Share Borders Under");

svg.append("text")
    .attr("x", 100)
    .attr("y", 115)
    .attr('id', 'title')
    .style('fill', 'steelblue')
    .attr("class", "heading")
    .text("Same Night Sky");

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}