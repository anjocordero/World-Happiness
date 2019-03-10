
var tooltip = d3.select("body").append("div") 
.attr("class", "tooltip")       
.style("opacity", 0);

var countrySel = "Armenia";
(function(){

  /******************************Global Variables **********************************/
  
  var boundingBox = d3.select("#map").node().getBoundingClientRect();

  let margin = { top: 0, left: 0, right: 0, down: 0},
    height = 690,
    width = boundingBox.width;

  let zoom = d3.zoom()
    .scaleExtent([.5, 8])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

var url1 = "./data/countries_processed.csv";
var url2 = "./data/world_countries.json";
var url3 = "./data/nfa2018.csv";




var q = d3_queue.queue(1)
.defer(d3.csv, url1)
.defer(d3.json, url2)
.defer(d3.csv, url3)
.awaitAll(draw);






var color = d3.scaleLinear()
    .domain([0,80])
    .range(["#fff7ec", "#d7301f"]);


/****************************** End Global Variables **********************************/



/****************************Math Functions *****************************/

function cross(u, v) {
  return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
}

//Dot product returns scalar magnitude
function dot(u, v) {
  for (var i = 0, sum = 0; u.length > i; ++i) sum += u[i] * v[i];
  return sum;
}


function lonlat2xyz(coord){

var lon = coord[0] * toRad;
var lat = coord[1] * toRad;

var x = Math.cos(lat) * Math.cos(lon);

var y = Math.cos(lat) * Math.sin(lon);

var z = Math.sin(lat);

return [x, y, z];
}


function quaternion(v, u) {

if (v && u) {

    var w = cross(v, u),  // vector pendicular to v & u
        w_len = Math.sqrt(dot(w, w)); // length of w
      if (w_len == 0){
        return [1,0,0,0];
      }

      let theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v, u))));

      let qi  = w[2] * Math.sin(theta) / w_len;
      let  qj  = - w[1] * Math.sin(theta) / w_len;
      let qk  = w[0]* Math.sin(theta) / w_len;
      let  qr  = Math.cos(theta);


    return [qr, qi, qj, qk];
}
}


function euler2quat(e) {

if(!e) return;

  var roll = .5 * e[0] * toRad,
      pitch = .5 * e[1] * toRad,
      yaw = .5 * e[2] * toRad,

      sr = Math.sin(roll),
      cr = Math.cos(roll),
      sp = Math.sin(pitch),
      cp = Math.cos(pitch),
      sy = Math.sin(yaw),
      cy = Math.cos(yaw),

      qi = sr*cp*cy - cr*sp*sy,
      qj = cr*sp*cy + sr*cp*sy,
      qk = cr*cp*sy - sr*sp*cy,
      qr = cr*cp*cy + sr*sp*sy;

  return [qr, qi, qj, qk];
}


function quatMultiply(q1, q2) {
if(!q1 || !q2) return;

  var a = q1[0],
      b = q1[1],
      c = q1[2],
      d = q1[3],
      e = q2[0],
      f = q2[1],
      g = q2[2],
      h = q2[3];

  return [
   a*e - b*f - c*g - d*h,
   b*e + a*f + c*h - d*g,
   a*g - b*h + c*e + d*f,
   a*h + b*g - c*f + d*e];

}


function quat2euler(t){

if(!t) return;

return [ Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * toDeg,
     Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * toDeg,
     Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * toDeg
    ]
}


function eulerAngles(v, u, o0) {

var t = quatMultiply( euler2quat(o0), quaternion(lonlat2xyz(v), lonlat2xyz(u)));
return quat2euler(t);
}
/**************************** End Math Functions *****************************/







  let drag = d3.drag()
    .on("start", dragstart)
    .on("drag", dragged)

  let vInit, o0;

  function dragstart(){
  	vInit = projection.invert(d3.mouse(this));
  	svg.insert("path")
       .datum({type: "Point", coordinates: vInit})
       .attr("class", "point")
       .attr("d", path);
  }

  function dragged(){
  	var vFin = projection.invert(d3.mouse(this));
  	o0 = projection.rotate();

  	var o1 = eulerAngles(vInit, vFin, o0);
  	projection.rotate(o1);

  	svg.selectAll(".point")
  	 		.datum({type: "Point", coordinates: vFin});
    svg.selectAll("path").attr("d", path);

  }
//


  let svg = d3.select("#map")
              .append("svg")
              .attr("height", "100%")
              .attr("width", "100%" )
              .call(drag)
              .call(zoom)



  let map = svg.append("g")
                .attr("transform", "translate("+ margin.left + "," + margin.top +")");
  

  var earthScale = 250;


  var backgroundCircle = map.append("circle")                
                .attr("height", 100)
                .attr("width", 100)
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("r", earthScale)
                .attr("fill", "#B5BFBE")

  

  var projection = d3.geoOrthographic()
                .translate([ width / 2, height / 2 ])
                .rotate([100, -30, 0])
                .scale(earthScale);




    function zoomed() {
      map.attr("transform", d3.event.transform );
    }



var path = d3.geoPath()
  .projection(projection);


  



   
  

function draw(error, data) 
{

  var field = undefined;
  
  
  drawParallel(data[0], field);
  drawDifference(data[0], field);

  

  map.selectAll(".country")
    .data(data[1].features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("stroke", "white")
    .attr("stroke-wdith", "0.5px")
    .attr("d", path)
    .on("mouseover", function(d){
      d3.select(this)
      .classed("activeCountry", true)
      tooltip.transition()    
      .duration(200)    
      .style("opacity", .9);    
      tooltip
      .style("font", "12px sans-serif")
      .style("background", "lightsteelblue")
      .style("text-align", "center")
      .style("height", "70px")
      .html(d.properties.name + "Year <br>" + d.year +"<br> BioCapcity in GHA: " + d.GDP )  
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
    .on("click", function(d){
      drawParallel(data[0], (d.properties.name));
      drawDifference(data[0], (d.properties.name));
      
      });
    map.selectAll(".country")
      .datum(function(d)
      {
        
        var corrName =  d.properties.name;
        data[2] = data[2].filter(function(d){return d.year == yearSel &&  d.record == "BiocapPerCap"});
        
        
        var index = data[2].findIndex(function(p){
          // console.log(p)          
          return (p.country == corrName)});

          // console.log(index);
          
        if(index != -1)
        {
          d.GDP = data[2][index]["total"];
          d.year = yearSel;
          
        }
        else d.GDP = 0;
          return d;
      })
    map.selectAll(".country")
    .attr("fill",function(d)
    {
      return color(d.GDP);
    })

    d3.select("#dropdown")
    .on("change", function()
    {
      yearSel = document.getElementById("dropdown").value;
      map.selectAll(".country")
      .attr("fill",function(d)
      {
        return color(d.GDP);
      })
    })

    
    //legends
    var legendHeight = 150;
    var legendWidth = 1200;

    var legendSvg = d3.select('#legend')
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight);

    var legend = legendSvg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");
    

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#fff7ec")
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#d7301f")
      .attr("stop-opacity", 1);

      legendSvg.append("rect")
      .attr("x", 4)
      .attr("width", 496)
      .attr("height", "20")
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");
    
    var xScale = d3.scaleLinear()
      .range([499, 5])
      .domain([80, 0]);

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5);

    legendSvg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,30)")
      .call(xAxis)
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("font-size", 14)
      .attr("x", 65)
      .attr("y", 32)
      .style("text-anchor", "left")
      .text("Biocapcity in GHA");
    




  
  }


      
})();
