var boundingBoxForce = d3.select("#force").node().getBoundingClientRect();


var forceWidth = boundingBoxForce.width,
    forceHeight = boundingBoxForce.height;

var svgForce = d3.select("#force");

  

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(linkDistance).id(function(d) { return d.id; }))
	.force('charge', d3.forceManyBody()
    .strength(-1000)
    .theta(0.9)
    .distanceMax(1500))
    .force("center", d3.forceCenter(forceWidth / 2, forceHeight / (4.5)))

// let graph = 
// {
//   "nodes": [
//     {"id": 1},
//     {"id": 2},
//     {"id": 4},
//     {"id": 8},
//     {"id": 16},
//   ],
//   "links": [
//     {"source": 2, "target": 1, "value": 1 , "distance": 30},
//     {"source": 4, "target": 1, "value": 1, "distance": 15},
//     {"source": 4, "target": 1, "value": 1, "distance": 50},
//     {"source": 8, "target": 1, "value": 1, "distance": 60},
//     {"source": 16, "target": 1, "value": 1, "distance": 100}
//   ]
// }

function drawForce(data, country, selection) 
{
    d3.select('#force').selectAll('g').remove();
    selection = "Economy..GDP.per.Capita."
    // console.log(data[1]);

    var key = 0;
    // graph = [];
    var graph = {"nodes": [], "links":[]};
    // var indexArr = [];
    
    graph.nodes.push({"id": country, "name": data[1][country]["Country"]});

    if(country < 5)
    {
        key = 1;
        var j = 5-country;
        
        
        for(var i = 1; i < 6 + j; i++) 
        {
            graph.nodes.push({"id": country + i, "name": data[1][country + i]["Country"]});

            graph.links.push({"source": country + i, "target": country, "value": data[1][country + i][selection], "distance": data[1][country + i][selection]})

        }

        for(var i = 1; i < country; i++)
        { 
            graph.nodes.push({"id": country - i, "name": data[1][country - i]["Country"]});

            graph.links.push({"source": country - i, "target": country, "value": data[1][country - i][selection], "distance": data[1][country - i][selection]});
        }
    }

    if(country > 149)
    {
        key = 1;
        var j = country-5;
        
        for(var i = 1; i < j; i++) 
        {
            graph.nodes.push({"id": country + i, "name": data[1][country + i]["Country"]});

            graph.links.push({"source": country + i, "target": country, "value": data[1][country + i][selection], "distance": data[1][country + i][selection]})

        }

        for(var i = 1; i < 6 + j; i++)
        { 
            graph.nodes.push({"id": country - i, "name": data[1][country - i]["Country"]});

            graph.links.push({"source": country - i, "target": country, "value": data[1][country - i][selection], "distance": data[1][country - i][selection]});
        }
    }

    for(var i = 1; i < 6; i++)
    {  
        if(key == 1) break;

        graph.nodes.push({"id": country - i, "name": data[1][country - i]["Country"]});

        graph.links.push({"source": country - i, "target": country, "value": data[1][country - i][selection], "distance": data[1][country - i][selection]});

        graph.nodes.push({"id": country + i, "name": data[1][country + i]["Country"]});

        graph.links.push({"source": country + i, "target": country, "value": data[1][country + i][selection], "distance": data[1][country + i][selection]})
    }

    console.log(graph.links);


    var link = svgForce.append("g")
                .style("stroke", "#aaa")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line");

    var node = svgForce.append("g")
            .attr("class", "nodes")
    .selectAll("circle")
            .data(graph.nodes)
    .enter().append("circle")
            .attr("r", 5);
            
    var label = svgForce.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "label")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
            .attr("r", 16)
            .style("fill", "#efefef")
            .style("stroke", "#424242")
            .style("stroke-width", "1px")
            .attr("cx", function (d) { return d.x+5; })
            .attr("cy", function(d) { return d.y-3; });

    label
            .attr("x", function(d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .style("font-size", "10px").style("fill", "#333");
  }
}



function linkDistance(d) 
{
    
    return d.distance;
}
  
// drawForce(graph)