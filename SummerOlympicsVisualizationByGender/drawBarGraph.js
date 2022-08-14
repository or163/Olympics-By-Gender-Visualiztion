function drawBarGraph(countries, data, year, numberOfBars) {
    d3.select("#barChartWrapper").select("svg").selectAll("*").remove()
    const barSvg = d3.select("#barChartWrapper").select("svg")

    var tooltip = d3.select('#barChartWrapper').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
    const margin = {
        top: 20,
        right: 20,
        bottom: 55,
        left: 45
    }
    const width = +barSvg.attr("width")
    const height = +barSvg.attr("height") - margin.top - margin.bottom
    const g = barSvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .rangeRound([0, width-50])
        .padding(0.1)

    const y = d3.scaleLinear()
        .rangeRound([height, 0])

    let countriesOfYear = []
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == year) {
            countriesOfYear.push(element)
        }
    })
    var dat = countriesOfYear.map(function(d){
        return{
            Team: d.Team,
            MaleMedals: +d.MaleMedals,
            FemaleMedals: +d.FemaleMedals
        }
    });
    let countryNames = []
    countries["features"].forEach(d => countryNames.push(d["properties"]["name"]))
    countriesOfYear = countriesOfYear.filter(e => countryNames.includes(e["Team"]))
    countriesOfYear = countriesOfYear.sort((a, b) => {
        const aPop = Number(a.FemaleMedals)
        const bPop = Number(b.FemaleMedals) 
        if (aPop < bPop) {
            return 1
        } else if (bPop < aPop) {
            return -1
        } else {
            return 0
        }
    })

    // turning united states of america to usa because string is too long
    let newData = []
    countriesOfYear.forEach(element => {
        const team = element["Team"]
        if(team === "United States of America"){
            element["Team"] = "USA"
        }
        if(team === "Republic of Serbia"){
            element["Team"] = "Serbia"
        }
        newData.push(element);
    })
    
    console.log(newData)

    newData = newData.slice(0, numberOfBars)
    x.domain(newData.map((d) => d["Team"]))
    y.domain([0, d3.max(newData.map(e => Number(e["FemaleMedals"])))])


    g.append("g")
        .attr("transform", "translate(10," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-15,20)rotate(-45)")

    g.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Population");

    g.selectAll(".bar")
        .data(newData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d["Team"]))
        .attr("y", d => y(Number(d["FemaleMedals"])))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(Number(d["FemaleMedals"])))
        .style("fill", barColor)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("id", d => d["Team"])
        .on("mouseover", function (d) {
            this.style.fill = hoverColor
            this.style.cursor = "pointer"
            tooltip
            .html("Female Medals: " + d.FemaleMedals)
            .style("left", (parseInt(d3.mouse(this)[0])+25) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (parseInt(d3.mouse(this)[1])) + "px")
            .style("opacity", 1)
            .style("display", "inline-block");
            console.log(d.FemaleMedals)
        })
        .on("mouseout", function () {
            this.style.fill = barColor
            tooltip
            .transition()
            .duration(0)
        .style("display", "none")
        })

        barSvg.append('text')
        .attr("transform", "rotate(-90)")
        .style('font-size', '15px')
        .attr("y", 0)
        .attr("x",0 - (h / 2) + 70)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text('Female Medals');

        countriesOfYear.forEach(element => {
            const team = element["Team"]
            if(team === "USA"){
                element["Team"] = "United States of America"
            }
            if(team === "Serbia"){
                element["Team"] = "Republic of Serbia"
            }
            newData.push(element);
        })

        barSvg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 147)
        .attr("y", 15 )
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Top 10 Countries With most female medals")
        .attr("text-anchor", "start")
}

function displayMedalsGivenYear(year) {
    Promise.all([
        d3.json('world.geojson'),
        d3.csv('OlympicData.csv')
    ]).then(([countries, data]) => {
        createMap(countries, data, year, svgContainer)
    })
}

function cycle(year) {
    if (year === 2017) {
        return
    }
    const millisecondsToWait = 700;
    setTimeout(function () {
        displayMedalsGivenYear(year)
        drawBarGraphFromYear(year)
        cycle(year + 1)
        document.getElementById("currentYearText").innerHTML = `Current Year: ${year}`
    }, millisecondsToWait);
}

function drawBarGraphFromYear(year) {
    Promise.all([
        d3.json('world.geojson'),
        d3.csv('OlympicData.csv')
    ]).then(([countries, data]) => {
        drawBarGraph(countries, data, year, 10)
    })
}
