
var yearSel = 2014;
var masterArr = [];




function drawParallel(data, field) 
{
  
  
  
  d3.selectAll('#parallel').select('.foreground').remove();
  masterArr = [];
  
  
  var svg = d3.select("#parallel");
 
  // set the dimensions and margins of the graph
  var margins = 
  {
      top: 0,
      right: 20,
      bottom: 10,
      left: 40
  };


  var boundingBox = svg.node().getBoundingClientRect();
      
    
  var svgHeight = boundingBox.height - margins.top-margins.bottom - 400
  var svgWidth = boundingBox.width;


  // set the drawing ranges
  var x = d3.scalePoint().range([0, svgWidth]).padding(1),
  y = {};

  svg
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g");

  var line = d3.line(),
    axis = d3.axisLeft();



    
  d3.csv("./data/nfa2018.csv", function(error, data) 
  {
    if (error) throw error;

    data=data.filter(function(d){return d.year == yearSel });


    var dataCounter = 0;
    var tempObj = {};
    data.forEach(function(d)
    {
      
        // console.log(d);
        if(dataCounter == 0)
        {
          
          tempObj = {name: d["country"],"GDP Percapita":d["Percapita GDP (2010 USD)"], Population:d["population"], "Biocapcity Percapita":d["total"]};
          
        } 
        
        else if(d["country"] == tempObj.name)
        {
          
          if(d["record"] == "EFConsPerCap")
          tempObj["Ecological Consumption Percapita"] = d["total"];

        }
        
        if(dataCounter >= 9) 
        {
          
          dataCounter = -1;
          masterArr.push(tempObj);
          // console.log(tempObj)
          tempObj = {};
        }

        dataCounter++;
    })

    // console.log(masterArr);
  
  
    // Scale the range of the data
    //d traverses the columns in the header row

    
    // console.log(data[250]); 
    x.domain(dimensions = d3.keys(masterArr[0]).filter(function(d) {
      
      
      return d != "name" && (y[d] = d3.scaleLinear()
          .domain(d3.extent(masterArr, function(p) { 
            //p traverses each rows/object
            // console.log(p);
            return +p[d]; }))
          .range([svgHeight, 30]));
    }));


    d3.select("#dropdown")
    .on("change", function()
    {
    yearSel = document.getElementById("dropdown").value;
    drawParallel(data,undefined);
    })
    
    

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(masterArr)
      .enter().append("path")
      .attr("stroke", function(d)
      {
        if(field == d.name) return "red";
        else return "steelblue";
      })
      .attr("opacity", function(d)
      {
        if(field == d.name) return 1;
        else return 0.3;
      })
      .attr("d", path);

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
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", 20)
        .text(function(d) { return d; });

  
  });


  function position(d) {
    var v;
    return v == null ? x(d) : v;
    
  }
  
  
  // Returns the path for a given data point.
  this.path = function(d)
  {    
    return line(dimensions.map(function(p) { 
      // console.log(d[p]);
      return [position(p), y[p](d[p])]; }));
  }
  
  
};
  

