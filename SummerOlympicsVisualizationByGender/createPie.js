function createPieGender(dat,country, year){


// set the dimensions and margins of the graph
const width = 300,
    height = 250,
    margin = 20;

//for future using in the pie function
var result = 0;
// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// create 2 data_set

const filteredData = dat.filter(d => d.Team === country & d.Year == year);
var dat1 = filteredData.map(function(d){
    return {
        Male: +d.MaleMedals,
        Female: +d.FemaleMedals
    }
});

var dat2 = filteredData.map(function(d){
    return {
        Male: +d.Male,
        Female: +d.Female
    }
});


const data = dat1[0]
const data2 = dat2[0]
var total1 = data.Male + data.Female;
var total2 = data2.Male + data2.Female;
d3.select("#svgContainer4").select("#svg1").selectAll("*").remove()
d3.select("#svgContainer4").select("#svg2").selectAll("*").remove()
d3.select("#svgContainer4").select("#svg3").attr("opacity", "0")
const svg = d3.select("#svgContainer4")
  .select("#svg1")
    .attr("width", width+300)
    .attr("height", height+115)

const vsvg = svg
  .append("g")
    .attr("transform", `translate(150,150)`);

// set the color scale

// Compute the position of each group on the pie:
const pie = d3.pie()
  .value(function(d) {return d[1]})
const data_ready = pie(Object.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

  const color = ["#6483ed","#ff99e6"]

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
vsvg
  .selectAll('mySlices')
  .data(data_ready)
  .join('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => color[i])
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
vsvg
  .selectAll('mySlices')
  .data(data_ready)
  .join('text')
  .text(function(d){
    if(d.data[1]==0){
        return ""
    }
    else{
      return (100*(d.data[1]/total1)).toPrecision(4) + "%"
    }
    })
  .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 13)

  svg.append("rect").attr("x",0).attr("y",5).style("fill", "#ff99e6").attr("width",15).attr("height", 15)
  svg.append("rect").attr("x",0).attr("y",23).style("fill", "#6483ed").attr("width",15).attr("height", 15)
  svg.append("text").attr("x", 20).attr("y", 13).text("Female").style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 20).attr("y", 31).text("Male").style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")

  svg.append("text").attr("x", 110).attr("y", 31).text("Medal winners").style("font-size", "15px").style("font-family","Arial").attr("alignment-baseline","middle").attr("font-weight", "bold")
  svg.append("text").attr("x", 450).attr("y", 31).text("Athletes").style("font-size", "15px").style("font-family","Arial").attr("alignment-baseline","middle").attr("font-weight", "bold")


  svg.append("text").attr("x", 90).attr("y", 285).text("Male medals = " + data.Male).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 90).attr("y", 305).text("Female medals = " + data.Female).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 422).attr("y", 285).text("Male athletes = " + data2.Male).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 422).attr("y", 305).text("Female athletes = " + data2.Female).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 325).attr("y",14).text(country).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle").attr("text-anchor", "middle").attr("text-decoration", "underline")


  d3.select("#svgContainer4").select("#svg2").selectAll("*").remove()
  const svg2 = d3.select("#svgContainer4")
  .select("#svg2")
    .attr("width", width)
    .attr("height", height+115)
  .append("g")
  .attr("transform", `translate(150,150)`);

// Compute the position of each group on the pie:
const pie2 = d3.pie()
  .value(function(d) {return d[1]})
const data_ready2 = pie2(Object.entries(data2))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator2 = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg2
  .selectAll('mySlices')
  .data(data_ready2)
  .join('path')
    .attr('d', arcGenerator2)
    .attr('fill', (d, i) => color[i])
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg2
  .selectAll('mySlices')
  .data(data_ready2)
  .join('text')
  .text(function(d){
    if(d.data[1]==0){
        return ""
    }
    else{
      return (100*(d.data[1]/total2)).toPrecision(4) + "%"
    }
    })
  .attr("transform", function(d) { return `translate(${arcGenerator2.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 13)
}



function createPieMedals(dat,country, year){
    // set the dimensions and margins of the graph
    const width = 350,
        height = 250,
        margin = 20;
    
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin
    
    // create 2 data_set
    
    const filteredData = dat.filter(d => d.Team === country & d.Year == year);
    
    var dat2 = filteredData.map(function(d){
        return {
            Gold: +d.Gold,
            Silver: +d.Silver,
            Bronze: +d.Bronze
        }
    });
    
    const data = dat2[0]
    var total = data.Gold + data.Silver + data.Bronze;
    
    d3.select("#svgContainer4").select("#svg1").selectAll("*").remove()
    d3.select("#svgContainer4").select("#svg2").selectAll("*").remove()
    d3.select("#svgContainer4").select("#svg3").selectAll("*").remove()
    const svg = d3.select("#svgContainer4")
      .select("#svg3")
        .attr("opacity", "1")
        .attr("width", width)
        .attr("height", height + 115)
    const vsvg = svg  
      .append("g")
        .attr("transform", `translate(170,135)`);
    
    
    
    // set the color scale
    const color = ["#FFD700","#C0C0C0","#CD7F32"]
    
    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .value(function(d) {return d[1]})
    const data_ready = pie(Object.entries(data))
    // Now I know that group A goes from 0 degrees to x degrees and so on.
    
    // shape helper to build arcs:
    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    vsvg
      .selectAll('mySlices')
      .data(data_ready)
      .join('path')
        .attr('d', arcGenerator)
        .attr('fill', (d, i) => color[i])
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
    
    // Now add the annotation. Use the centroid method to get the best coordinates
    vsvg
      .selectAll('mySlices')
      .data(data_ready)
      .join('text')
      .text(function(d){ 
        if(d.data[1]==0){
          return ""
      }
      else{
        return (100*(d.data[1]/total)).toPrecision(4) + "%"
      }
            })
      .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
      .style("text-anchor", "middle")
      .style("font-size", 13)

  svg.append("rect").attr("x",0).attr("y",5).style("fill", "#FFD700").attr("width",15).attr("height", 15)
  svg.append("rect").attr("x",0).attr("y",23).style("fill", "#C0C0C0").attr("width",15).attr("height", 15)
  svg.append("rect").attr("x",0).attr("y",41).style("fill", "#CD7F32").attr("width",15).attr("height", 15)
  svg.append("text").attr("x", 20).attr("y", 13).text("Gold").style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 20).attr("y", 31).text("Silver").style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 20).attr("y", 49).text("Bronze").style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")


  svg.append("text").attr("x", 113).attr("y", 270).text("Gold medals = " + data.Gold).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 113).attr("y", 290).text("Silver medals = " + data.Silver).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 113).attr("y", 310).text("Bronze athletes = " + data.Bronze).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 175).attr("y",13).text(country).style("font-size", "13px").style("font-family","Arial").attr("alignment-baseline","middle").attr("text-anchor", "middle").attr("text-decoration", "underline")

}
    

