function createAreaChart(data1, country, svg) {

    
            // set the dimensions and margins of the graph
    const margin = {top: 60, right: 230, bottom: 50, left: 120},
    width = 970 - margin.left - margin.right,
    height = 235 - margin.top - margin.bottom;
  
    // stacked groups
    const myGroups = ["FemaleMedals", "MaleMedals"];

    const countryYears = data1.filter(d => d.Team === country);
    
    var dat = countryYears.map(function(d) {
        return {
        Year: d.Year,
        FemaleMedals: d.FemaleMedals,
        MaleMedals: d.MaleMedals

        }
    });

    var k = 0;
    var data = [];
    for(i = 0; i<dat.length; i++){
        data.push({Year:dat[i]["Year"], Medals:dat[i][myGroups[k%2]], resourceType:myGroups[k%2]})
        if(k%2===0){
        i--
        }
        k++
    }

    
        // append the svg object to the body of the page
    svg.selectAll("*").remove();
    svg
    .append("g")
    .attr("transform",
            "translate(" + 140 +  "," + margin.top + ")");

            console.log(d3.extent(data, (d) => new Date(d.Year)))
    // Add X axis --> it is a date format
    const x = d3
      .scaleTime()
      .domain([d3.min(data, (d) => new Date(d.Year))-2,d3.max(data, (d) => new Date(d.Year))])
      .range([0, width]);
      svg.append("g")
      .attr("transform", "translate(30,135)")
      .call(d3.axisBottom(x).ticks(16))

      // Add X axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width+20)
        .attr("y", height+42 )
        .attr("font-size","14")
        .text("Year");
  
    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, d3.max(countryYears, function(d) { return +d.TotalMedals+60; })])
    .range([height, 0]);
    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(30,10)")
    .call(d3.axisLeft(y));

    // Add Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 25)
    .attr("y", 10)
    .attr("font-size","14")
    .text("Medals")
    .attr("text-anchor", "start")
  
    let sumstat = d3
      .nest()
      .key((d) => {
        return d.Year;
      })
      .entries(data);
  
    const stackedData = d3
      .stack()
      // .keys(myGroup)
      .keys(myGroups)
      .value((data, key) => {
        return data &&
          data.values &&
          data.values.find((d) => d.resourceType === key) ?
          +data.values.find((d) => d.resourceType === key).Medals :
          null;
      })(sumstat);
  
    const color = d3
      .scaleOrdinal()
      .domain(myGroups)
      .range(["#ff99e6", "#6483ed"]);

      const areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")
        .attr("transform", "translate(30,10)")
 
    // Show the areas
    areaChart
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .style("fill", (d) => color(d.key))
      .attr(
        "d",
        d3
        .area()
        .x(function(d) {
          return x(new Date(d.data.key));
        })
        .y0(function(d) {
          return y(+d[0]);
        })
        .y1(function(d) {
          return y(+d[1]);
        })
      );
  
    // tooltip with hover point and line
    function mouseMove() {
      d3.event.preventDefault();
      const mouse = d3.mouse(d3.event.target);
      const [xCoord, yCoord] = mouse;
      const mouseDate = x.invert(xCoord);
  
      // Use `sumstat`, not `data`, to get the correct data object for all traces
      const bisectDate = d3.bisector(d => new Date(d.key)).left;
      const xIndex = bisectDate(sumstat, mouseDate);
  
      // We get the key directly from xVal
      const xVal = new Date(sumstat[xIndex].key);
  
      if (x(xVal) <= 0) return;
  
      areaChart
        .selectAll(".hoverLine")
        .attr("x1", x(xVal))
        .attr("y1", y.range()[0])
        .attr("x2", x(xVal))
        .attr("y2", y.range()[1])
        .attr("stroke", "#69b3a2")
        .attr("fill", "#cce5df");
      
      const isLessThanHalf = xIndex > sumstat.length / 2;
      const hoverTextX = isLessThanHalf ? "-0.75em" : "0.75em";
      const hoverTextAnchor = isLessThanHalf ? "end" : "start";
  
      // Create a mapping of type (FemaleMedals/MaleMedals) to single and stacked Y values
      const yVals = {
        FemaleMedals: { color: "#ffaddf" },
        MaleMedals: { color: "#ab00d6" }
      };
      
      sumstat[xIndex].values.forEach((el) => {
        // Get the single values from `sumstat`
        yVals[el.resourceType].Medals = el.Medals;
      });
      stackedData.forEach((group) => {
        // Get the cumulative values from `stackedData`
        yVals[group.key].cumulative = group[xIndex][1];
      });    
  
      let hoverPoints = areaChart
        .selectAll(".hoverPoint")
        .data(Object.values(yVals));
      
      const newHoverPoints = hoverPoints
        .enter()
        .append("g")
        .classed("hoverPoint", true);
      
      newHoverPoints
        .append("circle")
        .attr("r", 6)
        .attr("fill", d => d.color);
      
      newHoverPoints
        .append("text")
        .attr("dy", "1em");
      
      newHoverPoints
        .merge(hoverPoints)
        .attr("transform", d => `translate(${x(xVal)}, ${y(d.cumulative)})`)
        .select("text")
        .attr("dx", hoverTextX)
        .style("fill", "black")
        .style("text-anchor", hoverTextAnchor)
        .attr("font-weight", "bold")
        .text(d => `${d.Medals || 0} Medals`);

        svg.selectAll(".tex").remove();
        svg.append("text")
          .attr("text-anchor", "end")
          .attr("class","tex")
          .attr("x", 100)
          .attr("y", 12 )
          .attr("font-size", "16px")
          .text(sumstat[xIndex].values[0].Year)
          .attr("text-anchor", "start")
    }
  
    areaChart.append("line").classed("hoverLine", true);
    areaChart
      .append("rect")
      .attr("fill", "transparent")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);
    areaChart.on("mousemove", mouseMove);

         //////////
// HIGHLIGHT GROUP //
//////////

// What to do when one group is hovered
const highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", .1)
    // expect the one that is hovered
    d3.select("."+d).style("opacity", 1)
  }
  
  // And when it is not hovered anymore
  const noHighlight = function(event,d){
    d3.selectAll(".myArea").style("opacity", 1)
  }
  
  
  
  //////////
  // LEGEND //
  //////////
  
  // Add one dot in the legend for each name.
  const size = 20
  svg.selectAll("myrect")
    .data(myGroups)
    .join("rect")
      .attr("x", 570)
      .attr("y", function(d,i){ return  i*(15)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size-10)
      .attr("height", size-10)
      .style("fill", function(d){ return color(d)})
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
  
  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(myGroups)
    .join("text")
      .attr("class", "legendText")
      .attr("x", 555 + size*1.2 + 5)
      .attr("y", function(d,i){ return i*(15) + (12/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return color(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
  
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", 160)
          .attr("y", 11 )
          .attr("font-size", "16px")
          .attr("font-weight", "bold")
          .text(function(){
              if(country === "United States of America"){
                  return "USA Medals by gender Breakdown"
              }
              if(country === "Republic of Serbia"){
                return "Serbia Medals by gender Breakdown"
              }
              else{
                  return country+ " Medals by gender Breakdown"
              }
          })
          .attr("text-anchor", "start")
  
  }
  
