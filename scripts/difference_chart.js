var path;
var countrySel = "China";

function drawDifference(data, field) 
{
  var yearArr = 
[
  {year: 1991},
  {year: 1992},
  {year: 1993},
  {year: 1994},
  {year: 1995},
  {year: 1996},
  {year: 1997},
  {year: 1998},
  {year: 1999},
  {year: 2000},
  {year: 2001},
  {year: 2002},
  {year: 2003},
  {year: 2004},
  {year: 2005},
  {year: 2006},
  {year: 2007},
  {year: 2008},
  {year: 2009},
  {year: 2010},
  {year: 2011},
  {year: 2012},
  {year: 2013},
  {year: 2014}

];
  
  countrySel = field;

  d3.select('#difference').selectAll('.axis').remove();
  d3.select('#difference').selectAll('.axisLabel').remove();
  d3.select('#difference').selectAll('path').remove();
  
  
  var svg = d3.select("#difference");
 
  // set the dimensions and margins of the graph
  var margin = 
  {
      top: 0,
      right: 20,
      bottom: 10,
      left: 40
  };


  var boundingBox = svg.node().getBoundingClientRect();
      
    
  var svgHeight = boundingBox.height - margin.top-margin.bottom - 550;
  var svgWidth = boundingBox.width  -100;


  // set the ranges
  var x = d3.scaleLinear().range([50, svgWidth]);
  var y = d3.scaleLinear().range([svgHeight, 0]);

  var xAxis = d3.axisBottom().scale(x);
  

  
    svg
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g");
      
    // Get the data
  d3.csv("./data/nfa2018.csv", function(error, data) 
  {
    if (error) throw error;

    var line = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d["year"]); })
    .y(function(d) { return y(d[countrySel]); });


    var area = d3.area()
    // .enter()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d["year"]); })
    .y1(function(d) { return y(d[countrySel]); });
  
    data=data.filter(function(d){return ((d.country == countrySel|| d.country == "World") && d.year >= 1991 && d.record == "EFConsPerCap")});
    

    var dataCounter = 0;
    var tempObj = {};
    data.forEach(function(d){

      d.year = +d.year;
      d.total = +d.total;

    })

    data.forEach(function(d)
    {
      
      switch(d.year)
      {
        case 1991:
            yearArr[0][d.country] = d.total;
            break;
        case 1992:
            yearArr[1][d.country] = d.total;
            break;
        case 1993:
          yearArr[2][d.country] = d.total;
          break;
        case 1994:
        yearArr[3][d.country] = d.total;
        break;
        case 1995:
        yearArr[4][d.country] = d.total;
        break;
        case 1996:
        yearArr[5][d.country] = d.total;
        break;
        case 1997:
        yearArr[6][d.country] = d.total;
        break;
        case 1998:
        yearArr[7][d.country] = d.total;
        break;
        case 1999:
        yearArr[8][d.country] = d.total;
        break;
        case 2000:
        yearArr[9][d.country] = d.total;
        break;
        case 2001:
        yearArr[10][d.country] = d.total;
        break;
        case 2002:
        yearArr[11][d.country] = d.total;
        break;
        case 2003:
        yearArr[12][d.country] = d.total;
        break;
        case 2004:
        yearArr[13][d.country] = d.total;
        break;
        case 2005:
        yearArr[14][d.country] = d.total;
        break;
        case 2006:
        yearArr[15][d.country] = d.total;
        break;
        case 2007:
        yearArr[16][d.country] = d.total;
        break;
        case 2008:
        yearArr[17][d.country] = d.total;
        break;
        case 2009:
        yearArr[18][d.country] = d.total;
        break;
        case 2010:
        yearArr[19][d.country] = d.total;
        break;
        case 2011:
        yearArr[20][d.country] = d.total;
        break;
        case 2012:
        yearArr[21][d.country] = d.total;
        break;
        case 2013:
        yearArr[22][d.country] = d.total;
        break;
        case 2014:
        yearArr[23][d.country] = d.total;
        break;
      }

        
        
    })
    
    // console.log(yearArr);
    x.domain(d3.extent(data, function(d) { return d.year; }));

    y.domain([
      d3.min(data, function(d) { return Math.min(d.total); }),
      d3.max(data, function(d) { return Math.max(d.total); })
    ]);
        
    svg.datum(yearArr).enter();

    
    
  svg.append("path")
      .attr("class", "area above")
      .attr("clip-path", "url(#clip-above)")
      
      .attr("d", area.y0(function(d) {  return y(d["World"]); }));

  svg.append("path")
      .attr("class", "area below")
      .attr("clip-path", "url(#clip-below)")
      
      .attr("d", area);

  

      svg.append("clipPath")
      .attr("id", "clip-above")
      .append("path")
      .attr("d", area.y0(0));

      svg.enter().append("clipPath")
      .attr("id", "clip-below")
      .append("path")
      .attr("d", area.y0(svgHeight));

  svg.append("path")
      .attr("class", "line")
      .attr("d", line);


  // Axes
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(50" + ", 0" + ")")
      .call(d3.axisLeft()
      .scale(y))
      // .ticks(8))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ecological Footprint Percapita");
    
    
      d3.select('#heading')
      .text("Ecological Consumption compared with World average")
      .attr("y", 10);


  });
};
  