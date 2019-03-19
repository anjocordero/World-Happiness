


/******************************Global Vars *********************/


var tooltip = d3.select("body").append("div") 
.attr("class", "tooltip")       
.style("opacity", 0);


var color = d3.scaleLinear()
.domain([3,8])
.range(["#fff7ec", "#2074B4"]); 


var boundingBox = d3.select("#map").node().getBoundingClientRect();

  let margin = { top: 0, left: 0, right: 0, down: 0},
    height = boundingBox.height,
    width = boundingBox.width,
    scale0 = (width - 1) / 2 / Math.PI;

var active = d3.select(null); 


var projection = d3.geoMercator()
.scale(200)
.translate([width / 2, height* (2/3) ]);

var zoom = d3.zoom().on("zoom", zoomed);
var path = d3.geoPath().projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

    svg.append("rect")
    .attr("class", "background")
    .attr("width", "100%")
    .attr("height", "100%")
    .on("click", reset);

    var g = svg.append("g");

    svg
        .call(zoom);



var url1 = "./data/world_countries.json";
var url2 = "./data/2017.csv";
// var url3 = "./data/data.json";

var q = d3_queue.queue(1)
    .defer(d3.json, url1)
    .defer(d3.csv, url2)
    // .defer(d3.json, url3)
    .awaitAll(drawMap);


/******************************Global Vars *********************/

/******************************Legends *********************/
var legendHeight = 1000;
var legendWidth = 300;

var legendSvg = d3.select('#legend')
.append("svg")
.attr("width", legendWidth)
.attr("height", legendHeight);

var legend = legendSvg.append("defs")
.append("svg:linearGradient")
.attr("id", "gradient")
.attr("x1", "0%")
.attr("y1", "100%")
.attr("x2", "0%")
.attr("y2", "0%")
.attr("spreadMethod", "pad");


legend.append("stop")
.attr("offset", "0%")
.attr("stop-color", "#fff7ec")
.attr("stop-opacity", 1);

legend.append("stop")
.attr("offset", "100%")
.attr("stop-color", "#2074B4")
.attr("stop-opacity", 1);

legendSvg.append("rect")
.attr("x", -10)
.attr("width", 20)
.attr("height", 400)
.style("fill", "url(#gradient)")
.attr("transform", "translate(40,10)");

var xScale = d3.scaleLinear()
.range([0, 398])
.domain([3, 8]);

var xAxis = d3.axisBottom()
.scale(xScale)
.ticks(2);

legendSvg.append("g")
.attr("class", "y axis")
.attr("transform", "translate(50,410) rotate(-90)")
.call(xAxis)
.append("text")
.attr("transform", "translate(-15,0) rotate(0)")
.attr("font-size", 14)
.attr("x", 65)
.attr("y", 32)
.style("text-anchor", "left")
.text("Happiness Score");


/******************************Legends *********************/


/******************************Functions*********************/


function drawMap(error, data) 
{


    var selection = "United States";
    var index;
    g.selectAll("path")
        .data(data[0].features)
        .enter().append("path")
        .attr("class", "country")
        .attr("stroke", "white")
        .attr("stroke-opacity",0.5)
        .attr("stroke-width", "0.4px")
        .attr("d", path)
        .attr("class", "feature")
        .attr("fill",function(d)
        {
            
            index = data[1].findIndex(function(p){
                if (d.properties.name == "Greenland")
                return (p.Country == "Denmark")
                else return (p.Country == d.properties.name)});
            if(index != -1)
            {
                d.happiness = data[1][index]["Happiness.Score"];
                d.index = index;
            }
            
            else return "grey"
            // console.log(d.happiness)     
            return color(d.happiness);
      
        })
        .on("click", function(d){
            if (active.node() === this) return reset();
            active.classed("active", false);
            d3.selectAll(".subActive").classed("subActive", false);
            active = d3.select(this).classed("active", true);
        
            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                translate = [width / 2 - scale * x, height / 2 - scale * y];
        
                // svg.transition()
                // .duration(750)
                // // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
                // .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4

            drawForce(data, d.index, "Happiness.Score")
            highlightParallel(data, d);
            }
        )
        .on("mouseover", function(d){
            
            d3.select(this)
            .classed("activeCountry", true)
            tooltip.transition()    
            .duration(200)    
            .style("opacity", 1);    
            tooltip
            .style("font", "12px sans-serif")
            .style("background", "lightsteelblue")
            .style("text-align", "center")
            .style("height", "40px")
            .html(function()
            {
                if(d.happiness != undefined)
                return d.properties.name + " <br> Happiness Score: <br>" + d.happiness
                else 
                return d.properties.name + " <br> Happiness Score: <br> No Data"
            })  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 33) + "px");}
            )
        .on("mouseout", function(d){
            d3.select(this)
            .classed("activeCountry", false)
            tooltip.transition()    
            .duration(500)    
            .style("opacity", 0);}
            )
        .on("mousemove", function(){
            tooltip
                .style("top", (d3.event.pageY - 10) + "px" )
                .style("left", (d3.event.pageX + 10) + "px");}
              )
};


function redrawMap(fieldMain, fieldSub)
{

    svg.selectAll(".feature")
    .classed("active", function(d)
        {   
            
            if(fieldMain == undefined)
            {return false;}

            if(d.properties.name == fieldMain["name"]) return true;

            // else {return false;}

        })
    .classed("subActive", function(d)
        {
            if(fieldSub != undefined)
            {
                for(var i = 0; i < fieldSub.length; i++)
                {
                    // console.log(fieldSub[i]["name"]);
                    if(d.properties.name == fieldMain["name"]) {return false}
                    else if(d.properties.name == fieldSub[i]["name"]) {return true};
                }
            }
        })


        
        //  function(d)
        // {   
        //     if(d.properties.name == selection) return 0.5;
        //     else if(d.properties.name == fieldSub) return 0.5;
        //     else return 0.5;
        // }

}

function dedrawMap(fieldMain)
{
    svg.selectAll(".feature")
    .classed("active", function(d){
        if(d.properties.name == fieldMain["name"]) return true;
    else return false;

    })
}


function reset() 
{
    active = d3.select("#map").selectAll(".active")
    active.classed("active", false);
    d3.selectAll(".subActive").classed("subActive", false);
    active = d3.select(null);
  
    // Reset parallel coordinate highlighting
    d3.selectAll(".Parallel")
        .transition()
        .style("stroke", "steelblue")
        .style("stroke-width", "2px")
        .style("opacity", 1);

    svg.transition()
        .duration(750)
        // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}
  
function zoomed() 
{
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
    g.attr("transform", d3.event.transform); // updated for d3 v4
}
  
  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
function stopped() 
{
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}