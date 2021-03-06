function draw(data) {
    var dates = [];
    var years = [];
    var occurencesPerYear = [];
    var newDataSet = [];

    var margin = 40;
    var width = 800;
    var height = 500;

    data.forEach(function(d) {
        if(!(parseInt(d.latitude) == 0 && parseInt(d.longitude) == 0)) 
            dates.push(d.datetime);
    });

    dates.forEach(function(entry) {
        var year = entry.split("/")[2].split(" ")[0];

        if(years.indexOf(year) == -1)
            years.push(year);

        if(occurencesPerYear[year] != null)
            occurencesPerYear[year] += 1;
        else
            occurencesPerYear[year] = 1;
    });


    years.sort().forEach(function(year) {
        var obj = new Object;
        obj["year"] = year;
        obj["Sightings"] = occurencesPerYear[year];
        newDataSet.push(obj);
    });
    
    var maxSightings = 0;
    newDataSet.forEach(function(data){
        if(data.Sightings > maxSightings)
        maxSightings = data.Sightings;
    });

    var y_extent = [0, maxSightings];
    var y_scale = d3.scaleLinear().range([height - margin, margin]).domain(y_extent).nice();
    var x_extent = [newDataSet[0].year, newDataSet[newDataSet.length-1].year];
    var x_scale = d3.scaleLinear().range([margin, width - margin]).domain(x_extent).nice();
    var x_axis = d3.axisBottom(x_scale).tickFormat(d3.format("d"));
    var y_axis = d3.axisLeft(y_scale).ticks(maxSightings/500);

    var svg = d3.select("#putGraphic")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "white")
        .attr("id","svg");

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.select("#svg").append("g").attr("class", "x axis").attr("transform", "translate(0," + (height - margin) + ")").call(x_axis);
    d3.select("#svg").append("g").attr("class", "y axis").attr("transform", "translate(" +  margin + ",0)").call(y_axis);

    var circles = svg.selectAll("circle")
        .data(newDataSet)
        .enter()
        .append("circle");

    circles.attr("cx", function (d) {  return x_scale(d.year);  })
        .attr("class", "dot")
        .attr("cy", function(d){return y_scale(d.Sightings)})
        .attr("r", function () { return 5; })
        .on("mouseover", function(d) {
            div.transition()
                .style("opacity", .9)
                .style("left", (d3.event.pageX-50) + "px")
                .style("top", (d3.event.pageY-50) + "px")
                .text("Year: " + d.year + "\n" + "Sightings: " + d.Sightings);
        })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0);
        });

    var line = d3.line()
        .x(function (d) { return x_scale(d.year) })
        .y(function (d) { return y_scale(d.Sightings) });

    d3.select("#svg").append("path").attr("d", line(newDataSet)).attr("class","path_class");

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", (margin/1.5))
        .attr("text-anchor", "middle")
        .attr("font-size", "30px")
        .text("UFO Sightings ao longo dos anos");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (margin+18) +","+(height/4)+")rotate(270)")
        .text("Quantidade de Sightings");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/1.1) +","+(height-(margin+6))+")")
        .text("Anos");

    // Add reference text
    svg.append("text")
        .attr("x", 300)
        .attr("y", 300)
        .text("Lançamento do programa \"The X-Files\"")
        .attr("font-family","Roboto");

    // Add reference line
    svg.append("line")
        .attr("x1", 410)
        .attr("y1", 310)
        .attr("x2", 592)
        .attr("y2", 430)
        .attr("class", "reference");
}