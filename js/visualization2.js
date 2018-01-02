var dataSetComplete = {};
var dataSetTimeDay = {};
var dataSetVisualization = [];

$(document).on('click', '#buttonReset', clearFilter);
$(document).on('change', '#dayLight', changeCheckbox);
$(document).on('change', '#afternoon', changeCheckbox);
$(document).on('change', '#night', changeCheckbox);

var margin = 40;
var width = 1000;
var height = 820;
var valueMin = 2003;
var valueMax = 2013;

var svg;

$(function() {
   $( "#slider-3" ).slider({
        values: [valueMin, valueMax],
        range: true,
        slide: function( event, ui ) {
            $( "#years" ).val(ui.values[ 0 ] + " - "+ui.values[ 1 ] );
        },
        change: function(event, ui) {
            timeDaysCheck = verifyItemCheck();
            changeDataSetVisualization($( "#slider-3" ).slider( "values", 0 ), $( "#slider-3" ).slider( "values", 1),
                "block", timeDaysCheck[0], timeDaysCheck[1], timeDaysCheck[2]);
        }
    });
    $( "#years" ).val($( "#slider-3" ).slider( "values", 0 ) +
        " - "+$( "#slider-3" ).slider( "values", 1 ) );
});


function map(data) {
    svg = d3.select("div")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", "lightblue");

    var yearMin = valueMin;
    var yearMax = valueMax;

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
            if (year >= valueMin && year <= valueMax) 
                dataSetVisualization.push(obj);
            
            if (year in dataSetComplete) {
                listValue = dataSetComplete[year];
                listValue.push(obj);
                listTimeDay = dataSetTimeDay[year];
                if (timeDay == "daylight")
                    listTimeDay[0]++;
                else if (timeDay == "afternoon")
                    listTimeDay[1]++;
                else
                    listTimeDay[2]++;
            }
            else {
                listValue = [];
                listValue.push(obj);
                dataSetComplete[year] = listValue;
                listTimeDay = []
                if (timeDay == "daylight")
                    listTimeDay = [1,0,0]
                else if (timeDay == "afternoon")
                    listTimeDay = [0,1,0]
                else
                    listTimeDay = [0,0,1]
                dataSetTimeDay[year] = listTimeDay;
            }

            if (yearMin > year)
                yearMin = year;
            if (yearMax < year)
                yearMax = year;
        }
    });
    
    setupSlider(yearMin, yearMax);

    console.log(dataSetVisualization.length);
    d3.json("data/countries.geo.json", drawAliensMap);
}

function drawAliensMap(data) {
    $('#dayLight').prop('disabled', true);
    $('#afternoon').prop('disabled', true);
    $('#night').prop('disabled', true);
    $('#buttonReset').prop('disabled', true);
    $("#load").css("display", "block");
    $( "#slider-3" ).slider( "disable" );
    console.log("dentro");
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

    var s = svg.selectAll(".mark");
    s.remove();

    svg.selectAll(".mark")
        .data(dataSetVisualization)
        .enter()
        .append("image")
        .attr('class','mark')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", "images/Alien.png")
        .attr("transform", function(d) { return "translate(" + projection([d.longitude,d.latitude]) + ")";});
    console.log("feito");
    $( "#load" ).css("display", "none");
    $('#dayLight').prop('disabled', false);
    $('#afternoon').prop('disabled', false);
    $('#night').prop('disabled', false);
    $('#buttonReset').prop('disabled', false);
    $( "#slider-3" ).slider( "enable" );
    verifyAvailability();
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

function setupSlider(min, max) {
    $('#slider-3').slider("option", "min", min);
    $('#slider-3').slider("option", "max", max);
    $( "#years" ).val($( "#slider-3" ).slider( "values", 0 ) +
        " - "+$( "#slider-3" ).slider( "values", 1 ) );
}

function changeDataSetVisualization(min, max, buttonDisplay, dayLightCheck, afternoonCheck, nightCheck) {
    $( "#buttonReset" ).css("display", buttonDisplay);
    dataSetVisualization = [];
    for (var year = min; year <= max; year++) {
        if (year in dataSetComplete) {
            dataSetComplete[year].forEach( function(d) {
                if (d.timeDay == dayLightCheck || d.timeDay == afternoonCheck || d.timeDay == nightCheck)
                    dataSetVisualization.push(d);
            })
        }
    }
    d3.json("data/countries.geo.json", drawAliensMap);
}

function clearFilter() {
    $("#slider-3").slider('values', 0, valueMin);
    $("#slider-3").slider('values', 1, valueMax);
    $( "#years" ).val($( "#slider-3" ).slider( "values", 0 ) +
        " - "+$( "#slider-3" ).slider( "values", 1 ) );
    $('#dayLight').prop('checked', true);
    $('#afternoon').prop('checked', true);
    $('#night').prop('checked', true);
    changeDataSetVisualization(valueMin, valueMax, "none", "dayLight", "afternoon", "night");
}

function changeCheckbox() {
    timeDaysCheck = verifyItemCheck();
    changeDataSetVisualization($( "#slider-3" ).slider( "values", 0 ), $( "#slider-3" ).slider( "values", 1),
                "block", timeDaysCheck[0], timeDaysCheck[1], timeDaysCheck[2]);
}

function verifyItemCheck() {
    var dayLightCheck = $('#dayLight').is(":checked") ? "daylight" : "";
    var afternoonCheck = $('#afternoon').is(":checked") ? "afternoon" : "";
    var nightCheck = $('#night').is(":checked") ? "night" : "";
    return [dayLightCheck, afternoonCheck, nightCheck];
}

function verifyAvailability() {
    var dayLightSightings = 0;
    var afternoonSightings = 0;
    var nightSightings = 0;
    for (var year =  $("#slider-3").slider('values', 0); year <=  $("#slider-3").slider('values', 1); year++) {
        if (year in dataSetTimeDay) {
            listTimeDay = dataSetTimeDay[year]
            dayLightSightings += listTimeDay[0];
            afternoonSightings += listTimeDay[1];
            nightSightings += listTimeDay[2];
        }
    }
    $('#dayLight').prop('disabled', dayLightSightings != 0 ? false : true);
    $('#afternoon').prop('disabled', afternoonSightings != 0 ? false : true);
    $('#night').prop('disabled', nightSightings != 0 ? false : true);
}