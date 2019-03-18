

var brush = d3.brush();

var url1 = "./data/world_countries.json";
var url2 = "./data/2017.csv";

var q = d3_queue.queue(1)
    .defer(d3.json, url1)
    .defer(d3.csv, url2)
    // .defer(d3.json, url3)
    .awaitAll(drawParallel);


var selectedCountry = null;

function highlightParallel(data, d)
{ 
  d3.selectAll(".Parallel")
    .filter(function(p){
      if (d.properties.name == "Greenland"){
        return p.Name == "Denmark";
      }
      else return p.Name !== d.properties.name;
    })
    .transition()
    .style("opacity", 0.2);

  d3.select("." + d.properties.name.replace(/ /g, "_"))
    .raise()
    .style("opacity", 1);

    selectedCountry = d // selectedCountry is from function(d)
    console.log(selectedCountry.properties.name);
}

function drawParallel(error, data)
{
  
  var masterArr = [];

  var line = d3.line(),
      axis = d3.axisLeft(),
      background,
      foreground;

  var boundingBoxParallel = d3.select("#parallel").node().getBoundingClientRect();


  var svgWidth = boundingBoxParallel.width,
  svgHeight = boundingBoxParallel.height;

  // set the drawing ranges
  var x = d3.scalePoint().range([0, svgWidth]).padding(1),
  y = {};

  var svg = d3.select("#parallel").append("svg");

  svg
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g");

  
    
    var dataCounter = 0;
    var tempObj = {};
    data[1].forEach(function(d)
    {
          // console.log(d);
      tempObj = {
                Name: d["Country"],
                Rank: d["Happiness.Rank"],
                Score:d["Happiness.Score"],
                GDP:d["Economy..GDP.per.Capita."],
                Family:d["Family"],
                Health:d["Health..Life.Expectancy."],
                Freedom:d["Freedom"],
                Generosity:d["Generosity"],
                Government:d["Trust..Government.Corruption."],
                "Dystopia Residual":d["Dystopia.Residual"]};
         masterArr.push(tempObj);
                
  
    })

    // console.log(masterArr);


    // Scale the range of the data
    //d traverses the columns in the header row

    var dimensions = {};

    x.domain(dimensions = d3.keys(masterArr[0]).filter(function(d) {
      
      
      return d != "Name" &&  d != "Rank" &&(y[d] = d3.scaleLinear()
          .domain(d3.extent(masterArr, function(p) { 
            //p traverses each rows/object
            // console.log(p);
            return +p[d]; }))
          .range([svgHeight - 30, 30]));
    }));

    // // Add blue foreground lines for focus.
    // console.log(masterArr)
    foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(masterArr)
      .enter()
      .append("path")
      .attr("stroke", "steelblue")
      .attr("stroke-opacity", 0.6)
      .attr("d", path)
      .on("mouseover", function(d){
            d3.select(this)
            .raise()
            .style("stroke", "red")
            .style("stroke-width", "4px")
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
                console.log(d);
                
                return d.Name + " <br> " + "Rank: <br>" + d.Rank
                
                
            })  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 33) + "px");}
            )
        .on("mouseout", function(d){
            d3.select(this)
            .style("stroke", "steelblue")
            .style("stroke-width", "2px")
            tooltip.transition()    
            .duration(500)    
            .style("opacity", 0);}
            )
        .on("mousemove", function(){
            tooltip
                .style("top", (d3.event.pageY - 10) + "px" )
                .style("left", (d3.event.pageX + 10) + "px");}
              );

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    //Add axis and title
    g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .on("click", function(d){

        switch(d){
          case "Score":
            selection =  "Happiness.Score";
            break;
          case "GDP":
            selection = "Economy..GDP.per.Capita.";
            break;
          case "Family":
            selection = "Family";
            break;
          case "Health":
            selection = "Health..Life.Expectancy.";
            break;
          case "Freedom":
            selection = "Freedom";
            break;
          case "Generosity":
            selection = "Generosity";
            break;
          case "Government":
            selection = "Trust..Government.Corruption.";
            break;
          case "Dystopia Residual":
            selection = "Dystopia.Residual";
        }

        drawForce(data, selectedCountry.index, selection);
      })
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", 20)
        .text(function(d) { return d; });


  function position(d) 
  {
    var v;
    return v == null ? x(d) : v;
  }


  // Returns the path for a given data point.
  function path(d)
  {  
    this.classList.add("Parallel");
    this.classList.add(d.Name.replace(/ /g, "_"));
    return line(dimensions.map(function(p) { 
      // console.log(d[p]);
      // console.log(p);
      return [position(p), y[p](d[p])]; }));
  }


}