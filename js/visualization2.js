function map(data) {
	var margin = 40;
    var width = 1100;
    var height = 820;

    newDataSet = [];

    var svg = d3.select("body")
    	.append("svg")
    	.attr("width", width)
    	.attr("height", height)
    	.style("background", "lightblue");

    data.forEach(function(d) {
        var obj = new Object;
        obj["city"] = d.city;
        obj["shape"] = d.shape;
        obj["latitude"] = d.latitude;
        obj["longitude"] = d.longitude;
        newDataSet.push(obj);
    });

    d3.json("data/countries.geo.json", function(data) {
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
    		.data(newDataSet)
        	.enter()
        	.append("image")
        	.attr('class','mark')
        	.attr('width', 20)
        	.attr('height', 20)
        	.attr("xlink:href", "images/Alien.png")
        	.attr("transform", function(d) { return "translate(" + projection([d.longitude,d.latitude]) + ")";});
    });

}