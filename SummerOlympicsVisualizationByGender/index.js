const hoverColor = "gold"
const barColor = "#ff99e6"
var selectedCountries = []

const toolTipDiv = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

const width = 1200
const height = 500
const selectionData = [];
var svgContainer = d3.select("#svgContainer").append("svg")
					.attr("width", 650)
					.attr("height", 300);
    
var svgContainer3 = d3.select("#svgContainer3").append("svg")
					.attr("width", 650)
					.attr("height", 450);


let button1 = document.getElementById("b1")
let button2 = document.getElementById("b2")
          
let valPicker = document.getElementById("valPicker")
var values = ["Female-Male Ratio", "Female-Male Absolute", "Female Medals", "Male Medals", "Total Medals"]
for (let i = 0; i < 5; i++) {
    valPicker.options[valPicker.options.length] = new Option(values[i], values[i])
}
valPicker.selectedIndex = values[0]

// Can't use arrow function because of scope
valPicker.onchange = function () {
    const selectedYear = d3.timeFormat('%Y')(sliderTime.value())
    const selected = this.value
    switch(selected){
        case "Female-Male Ratio" : 
        Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMap(countries, data, selectedYear, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            //make al circles visible again in transition
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;

        case "Female-Male Absolute" : 
        Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapAbsolute(countries, data, selectedYear, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            //make al circles visible again in transition
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;

        case "Female Medals" :
        Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapFemale(countries, data, selectedYear, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            //make al circles visible again in transition
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;

        case "Male Medals" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapMale(countries, data, selectedYear, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;

        case "Total Medals" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapTotal(countries, data, selectedYear, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;
    }
    
}

Promise.all([
    d3.json('world.geojson'),
    d3.csv('OlympicData.csv')
]).then(([countries, data]) => {
    console.log(data.columns.slice(6,8))
    createMap(countries, data, new Date(2016,10,3).getFullYear(), svgContainer, svg, svgContainer3)
    drawBarGraph(countries, data, new Date().getFullYear(), 10)
    createAreaChart(data, "United States of America", svgContainer3)
    createPieGender(data,"United States of America","2016")
    button1.onclick = function(){createPieGender(data, "United States of America", "2016")};
    button2.onclick = function(){createPieMedals(data, "United States of America", "2016")};
})
document.getElementById("currentYearText").innerHTML = `Current Year: ${new Date(2016,10,3).getFullYear()}`

// Map of country name to country color 
let colorOfCountries = {}


var margin = {top: 20, right: 20, bottom: 100, left: 100},
    w = 1200 - margin.left - margin.right,
    h = 420 - margin.top - margin.bottom;

var xValue = function(d) { return d.FemaleMedalRatio; }
    xScale = d3.scaleLinear().range([0, w-650]),
    xMap = function(d) { return xScale(xValue(d)); }
    xAxis = d3.axisBottom(xScale);

var yValue = function(d) { return d['MaleMedalsRatio']; },
    yScale = d3.scaleLinear().range([h, 0]),
    yMap = function(d) { return yScale(yValue(d)); }
    yAxis = d3.axisLeft(yScale);


var cValue = function(d) { return d.Continent; },
color = d3.scaleOrdinal(["#f781bf","#377eb8","#ffff33","#999999","#a65628"]);

var dataTime = d3.range(0, 121, 4).map(function(d) {
  return new Date(1896 + d, 10, 3);
})

var sliderTime = d3.sliderBottom()
                .min(d3.min(dataTime))
                .max(d3.max(dataTime))
                .step(1000 * 60 * 60 * 24 * 1452)
                .width(1000)
                .tickFormat(d3.timeFormat('%Y'))
                .tickValues(dataTime)
                .default(new Date(2016, 10, 3));

var margin_change = margin.left - 70;

var gTime = d3.select('div#slider-time').append('svg')
            .attr('width', w + margin.left + margin.right)
            .attr('height', 100)
            .attr('x',0)
            .append('g')
            .attr('transform', 'translate(' + 100 + ',' + margin.top +')');

gTime.call(sliderTime);

var svg = d3.select('#svgContainer2').append('svg')
        .attr('width', 470 + margin.left + margin.right)
        .attr('height', h + 70)
        .attr('top', 20)
        .attr('left', 50)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


        
d3.csv('OlympicData.csv').then(function(data) {

  data.forEach(function(d) {
    d.FemaleMedals = +d.FemaleMedals;
    d['MaleMedals'] = +d['MaleMedals'];
    d.FemaleMedalRatio = +d.FemaleMedalRatio;
    d['MaleMedalsRatio'] = +d['MaleMedalsRatio'];
    d.Year = +d.Year
  });

    var rScale = d3.scaleLinear()
                     .domain([0, d3.max(data, function(d) { return d.athletes; })])
                     .range([2, 6]);

    xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
    yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

    var xx = svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis)
          
          svg.append('text')
        .style('font-size', '15px')                
        .style("text-anchor", "middle")
        .attr("x", 225)
        .attr("y", 333 )
        .text('Female Medals ratio');
        
        var ticks = svg.selectAll(".tick text");

        ticks.attr("class", function(d,i){
          if(i%i == 1) d3.select(this).remove();
        });
        
        var yy = svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        svg.append('text')
        .attr("transform", "rotate(-90)")
        .style('font-size', '15px')
        .attr("y", 55 - margin.left)
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text('Male Medals Ratio');
        
        // Add a clipPath: everything out of this area won't be drawn.
                var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width+20 )
                .attr("height", height )
                .attr("x", 0)
                .attr("y", 0);
        
                
                // Add brushing
                var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
                .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
                
                // Create the scatter variable: where both the circles and the brush take place
                var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)")
                
        // A function that set idleTimeOut to null
        var idleTimeout
        function idled() { idleTimeout = null; }
        
        // A function that update the chart for given boundaries
        
        
        function updateChart() {
        
          extent = d3.event.selection
        
          // If no selection, back to initial coordinate. Otherwise, update X axis domain
          if(!extent){
          if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
          xScale.domain([ 0,1])
          
          }else{
            if(xScale.invert(extent[1]) > 1){
              xScale.domain([ xScale.invert(extent[0]), 1 ])
            }
            else{
              xScale.domain([ xScale.invert(extent[0]), xScale.invert(extent[1]) ])
            }
          scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
          }
        
          // Update axis and circle position
          xx.transition().duration(1000).call(d3.axisBottom(xScale))
          scatter
          .selectAll("circle")
          .transition().duration(1000)
          .attr("cx", function (d) { return xScale(d.FemaleMedalRatio); } )
          .attr("cy", function (d) { return yScale(d.MaleMedalsRatio); } )
        
        }
             
      scatter
      .append("g")
      .attr("class", "brush")
      .call(brush);

        var tooltip = d3.select('body').append('div')
                .attr('class', 'toooltip')
                .style('opacity', 0);

        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 95)
        .attr("y", 0 )
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Female Vs Male medals ratio")
        .attr("text-anchor", "start")

    function drawPlot(data, transition) {
      scatter.selectAll(".check").remove();
      xScale.domain([0,1])
      scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      if(transition == true) {
      scatter.selectAll('.circle')
            .data(data)
          .enter().append('circle')
            .attr('class', 'unselected')
            .attr('id', function(d){
              return d.NOC
            })
            .transition().duration(1000)
            .attr("r", function(d) {
              return d.athletes*0.035;
              })             
	    .attr('cx', xMap)
            .attr('cy', yMap)
            .style('fill', function(d) { return color(cValue(d)); })
      } else {
        scatter.selectAll('.circle')
              .data(data)
            .enter().append('circle')
              .attr('class', 'unselected')
              .attr('id', function(d){
                return d.NOC
              })
              .attr("r", function(d) {
    		return d.athletes*0.035;
	      })    
              .attr('cx', xMap)
              .attr('cy', yMap)
              .style('fill', function(d) { return color(cValue(d)); })
      }
      scatter.selectAll('circle')
            .data(data)
            .on('mouseover', function(d) {
              tooltip.transition()
                .duration(200)
                .style('opacity', .9);
              tooltip.html('Country: ' + d['Team'] + '<br> FemaleMedalsRatio: ' +  d.FemaleMedalRatio
               + '<br> MaleMedalsRatio: ' + d.MaleMedalsRatio + '<br> Female Medals: ' + d.FemaleMedals + '<br> Male Medals: ' + d.MaleMedals)
                  .style('left', (d3.event.pageX + 3) + 'px')
                  .style('top', (d3.event.pageY - 10) + 'px');
            })
            .on('mouseout', function(d) {
              tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            });


            if(d3.timeFormat('%Y')(sliderTime.value()) === "1916"){
              scatter.append("text")
              .attr("class", "check")
              .attr("text-anchor", "end")
              .attr("x", 20)
              .attr("y", 200 )
              .attr("font-size", "40px")
              .text("WWI No Olympic games")
              .attr("text-anchor", "start")
              .style("fill", "red")
              }

            if(d3.timeFormat('%Y')(sliderTime.value()) === "1940" | d3.timeFormat('%Y')(sliderTime.value()) === "1944"){
            scatter.append("text")
            .attr("class", "check")
            .attr("text-anchor", "end")
            .attr("x", 20)
            .attr("y", 200 )
            .attr("font-size", "40px")
            .text("WWII No Olympic games")
            .attr("text-anchor", "start")
            .style("fill", "red")
            }
      }

    update(d3.timeFormat('%Y')(sliderTime.value()) , true);

    function update(year, transition, regionFilter = false, region = "World") {
      selectedCountries = [];
      var newdata;
      if (regionFilter == true) {
        newdata = data.filter(function(d) {
          return d.Continent == region && d.Year == year;
        })
      }
      else if(regionFilter != true || region == "World") {
        newdata = data.filter(function(d, i) {
          return d.Year == year;
        })
      }
      svg.selectAll('circle').remove();
      drawPlot(newdata, transition);
      selected = valPicker.value
      switch(selected){
        case "Female-Male Ratio" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMap(countries, data, year, svgContainer, svgContainer3)
            drawBarGraph(countries, data, year, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = []; 
        })
        break;
        case "Female-Male Absolute" : 
        Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapAbsolute(countries, data, year, svgContainer, svgContainer3)
            drawBarGraph(countries, data, selectedYear, 10)
            //make al circles visible again in transition
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;
        case "Female Medals" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapFemale(countries, data, year, svgContainer, svgContainer3)
            drawBarGraph(countries, data, year, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;
        case "Male Medals" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapMale(countries, data, year, svgContainer, svgContainer3)
            drawBarGraph(countries, data, year, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;

        case "Total Medals" : Promise.all([
            d3.json('world.geojson'),
            d3.csv('OlympicData.csv')
        ]).then(([countries, data]) => {
            createMapTotal(countries, data, year, svgContainer, svgContainer3)
            drawBarGraph(countries, data, year, 10)
            var noc = "";
            for(i = 0; i<selectedCountries.length; i++){
              data.forEach(element => {
                const team = element["Team"]
                if (team === selectedCountries[i]) {
                    noc = element.NOC
                }
            })
              svg.
                selectAll(".unselected")
                .style("opacity", "1")
              svg
                .selectAll("#"+noc)
                .attr("class", "unselected");
              }
            selectedCountries = [];  
        })
        break;
    }
    document.getElementById("currentYearText").innerHTML = `Current Year: ${year}`

    }

    sliderTime.on('onchange', val => {
      update(d3.timeFormat('%Y')(val), false);
    })

    var button = svg.selectAll('.button')
                .data(color.domain())
              .enter()
                .append('g')
                .attr('class', 'button')
                .attr('transform', function(d, i) {
                  return 'translate(0,' + i * 20 +')';
                })


    var americaFlag = false, asiaFlag = false, oceaniaFlag = false, africaFlag = false, europeFlag = false
    button.append('rect')
        .attr('x', w  - 655)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

    button.append('text')
        .attr('x', w - 659)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d; })

        //making flags to indicate wether it is first or repeated selection
    button.on('click', function(d) {
      switch(d){
        case "Asia" : 
          asiaFlag = !asiaFlag;
          europeFlag = false;
          africaFlag = false;
          americaFlag = false;
          oceaniaFlag = false;
          if(asiaFlag){
            update(d3.timeFormat('%Y')(sliderTime.value()), false, true, d);
          }
          else{
            update(d3.timeFormat('%Y')(sliderTime.value()));
            asiaFlag = false;
            europeFlag = false;
            africaFlag = false;
            americaFlag = false;
            oceaniaFlag = false;
          }
          break;
        case "Europe" :
          europeFlag = !europeFlag;
          asiaFlag = false;
          africaFlag = false;
          americaFlag = false;
          oceaniaFlag = false;          
          if(europeFlag){
            update(d3.timeFormat('%Y')(sliderTime.value()), false, true, d);
          }
          else{
            update(d3.timeFormat('%Y')(sliderTime.value()));
            asiaFlag = false;
            europeFlag = false;
            africaFlag = false;
            americaFlag = false;
            oceaniaFlag = false;
          }
          break;
        case "Africa" :
          africaFlag = !africaFlag;
          asiaFlag = false;
          europeFlag = false;
          americaFlag = false;
          oceaniaFlag = false;
          if(africaFlag){
            update(d3.timeFormat('%Y')(sliderTime.value()), false, true, d);
            asiaFlag, europeFlag, africaFlag, americaFlag, asiaFlag = false
          }
          else{
            update(d3.timeFormat('%Y')(sliderTime.value()));
            asiaFlag = false;
            europeFlag = false;
            africaFlag = false;
            americaFlag = false;
            oceaniaFlag = false;
          }
          break;
        case "America" : 
          americaFlag = !americaFlag;
          asiaFlag = false;
          europeFlag = false;
          africaFlag = false;
          oceaniaFlag = false;          
          if(americaFlag){
            update(d3.timeFormat('%Y')(sliderTime.value()), false, true, d);
          }
          else{
            update(d3.timeFormat('%Y')(sliderTime.value()));
            asiaFlag = false;
            europeFlag = false;
            africaFlag = false;
            americaFlag = false;
            oceaniaFlag = false;
          }
          break;
        case "Oceania" : 
          oceaniaFlag = !oceaniaFlag;
          asiaFlag = false;
          europeFlag = false;
          africaFlag = false;
          americaFlag = false;
          if(oceaniaFlag){
            update(d3.timeFormat('%Y')(sliderTime.value()), false, true, d);
          }
          else{
            update(d3.timeFormat('%Y')(sliderTime.value()));
            asiaFlag = false;
            europeFlag = false;
            africaFlag = false;
            americaFlag = false;
            oceaniaFlag = false;
          }
          break;
      }
      console.log(americaFlag);
    })

});



