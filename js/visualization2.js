var dataSetComplete = {};
var dataSetVisualization = [];

function map(data) {
    data.forEach(function(d) {
        if(isNaN(d.latitude) == false && isNaN(d.longitude) == false ) {
            var obj = new Object;
            obj["datetime"] = d.datetime;
            obj["city"] = d.city;
            obj["country"] = d.country;
            obj["shape"] = d.shape;
            obj["comments"] = d.comments;
            obj["latitude"] = d.latitude;
            obj["longitude"] = d.longitude;
            timeDay = getPartOfDay(d.datetime);
            obj["timeDay"] = timeDay;
            var year = parseInt(d.datetime.split("/")[2].split(" ")[0]);
            if (year >= 2003 && year <= 2013) 
                dataSetVisualization.push(obj);
            
            if (year in dataSetComplete) {
                listValue = dataSetComplete[year];
                listValue.push(obj);
            }
            else {
                listValue = [];
                listValue.push(obj);
                dataSetComplete[year] = listValue;
            }
        }
    });
    
    console.log(dataSetVisualization.length);
    d3.json("data/countries.geo.json", drawAliensMap);

}

function drawAliensMap(data) {
    var margin = 40;
    var width = 1100;
    var height = 820;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "lightblue");
    
    var group = svg.selectAll("g")
        .data(data.features)
        .enter()
        .append("g")

    var projection = d3.geoMercator().scale(180);
    var path = d3.geoPath().projection(projection);

    var areas = group.append("path")
        .attr("d", path)
        .attr("class", "area")
        .attr("fill", "sienna");

    svg.selectAll(".mark")
        .data(dataSetVisualization)
        .enter()
        .append("image")
        .attr('class','mark')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "images/Alien.png")
        .attr("transform", function(d) { return "translate(" + projection([d.longitude,d.latitude]) + ")";});
}

function getPartOfDay(datetime) {
    var time = parseInt(datetime.split("/")[2].split(" ")[1].split(":"));
    if(time >= 6 && time < 12)
        return "daylight";
    else if(time >= 12 && time < 18)
        return "afternoon";
    else
        return "night";
}


