function createMap(countries, data, currentYear, svgContainer, svg2, svg4) {
    svgContainer.selectAll("*").remove()
    let countriesOfYear = {}
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == currentYear) {
            let nameOfCountry = element.Team
            countriesOfYear[nameOfCountry] = element;
        }
    })

    const threshHolds = [-0.5, 0.00000000001 , 0.25, 0.5, 1 , 2, 4, 50, 100, 200]
    const colors = ["#ffffff","#000080", "#0000e6", "#6483ed", "#b9c8fa", "#ffccf2", "#ff99e6", "#ff33cc", "#cc0099"]
    const widthOfLegendBox = 20
    svgContainer.selectAll(".legend")
        .data(threshHolds)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 600)
        .attr("y", (d, i) => 50 + (i * (widthOfLegendBox)))
        .attr("width", widthOfLegendBox)
        .attr("height", widthOfLegendBox)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("fill", (d, i) => colors[i])

    svgContainer.selectAll("text")
        .data(threshHolds)
        .enter()
        .append("text")
        .attr("x", 1050)
        .attr("y", 400)
        .attr("dy", ".35em");

    svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 537)
        .attr("y", 63 )
        .attr("font-size", "12px")
        .text("No Medals")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 512)
        .attr("y", 84 )
        .attr("font-size", "12px")
        .text("Only Male Won")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 500)
        .attr("y", 223 )
        .attr("font-size", "12px")
        .text("Only Female Won")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 243 )
        .attr("font-size", "12px")
        .text("No Data")
        .attr("text-anchor", "start")
    
    const colorScale = d3.scaleThreshold()
        .domain(threshHolds)
        .range(colors);

    var proj = d3.geoMercator()

    var gpath = d3.geoPath()
        .projection(proj);

        svgContainer.selectAll('path')
        // Get rid of Antartica and French Artic islands
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', gpath)
        .attr('stroke-width', 1)
        .attr('stroke', '#252525')
        .attr('fill', d => {
            if (d.properties.name in countriesOfYear) {
                const colorForCurrentCountry = colorScale(parseFloat(countriesOfYear[d.properties.name].Ratio))
                colorOfCountries[d.properties.name] = colorForCurrentCountry
                return colorForCurrentCountry
            } else {
                colorOfCountries[d.properties.name] = "black"
                return "black"
            }
        })
        .attr("id", d => `drawing-${d.properties.name}`)
        .on("mouseover", function () {
            this.style.cursor = "pointer"
            this.style.fill = hoverColor
            this.setAttribute("stroke-width", 2)
            this.setAttribute("stroke", "white")
            const countryName = this.id.replace("drawing-", "")
            var ratio = "No data for country"
            if(countriesOfYear[countryName] != null){
                   ratio= parseFloat(countriesOfYear[countryName].Ratio)
                   if(ratio === -1){ // case no medals for country
                    ratio = "No Medals"
                   }
                   if(ratio === 0){ //case only men won
                    ratio = "Only Male Won"
                   }
                   if(ratio === 100){
                    ratio = "Only Female Won"
                   }
            }
            toolTipDiv.transition()
                .duration(200)
                .style("opacity", .9)
            toolTipDiv.html(`${countryName}<br/>Ratio: ${ratio}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function () {
            this.setAttribute("stroke-width", 1)
            this.setAttribute("stroke", "black")
            const countryName = this.id.replace("drawing-", "")
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            if (!hasBeenSelected) {
                this.style.fill = colorOfCountries[countryName]
            }
            toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .on("click", function () {
            const countryName = this.id.replace("drawing-", "")
            createAreaChart(data,countryName,svg2)
            createPieGender(data, countryName, currentYear)

            button1.onclick = function(){createPieGender(data, countryName, currentYear)};
            button2.onclick = function(){createPieMedals(data, countryName, currentYear)};
            button1.onmouseover = function(){button1.style.cursor = "pointer"};
            button2.onmouseover = function(){button2.style.cursor = "pointer"};

            const datt = data.filter(d => d.Team === countryName & d.Year === currentYear)[0]
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            this.setAttribute("data-hasBeenSelected", !hasBeenSelected)
            if(!selectedCountries.includes(countryName) & datt.length !==0){
                svg.selectAll(".unselected").style("opacity", .1)
                svg.select("#"+datt.NOC).style("opacity", 1)
                .attr("class", "selected")
                selectedCountries.push(countryName);  
                if(countryName === "United States of America"){
                    svg.select("#United States of America").style("opacity", 1)
                }
                appendCountryBar(data, countries, currentYear)  
            }
            else{
                
                selectedCountries = selectedCountries.filter(contains);

                function contains(country) {
                return country !== countryName;
                }
                svg
                .selectAll("#"+datt.NOC)
                .style("opacity", .1)
                .attr("class", "unselected");
                appendCountryBar(data, countries, currentYear)  

                
            }
            if(selectedCountries.length === 0){
                svg.selectAll(".unselected").style("opacity", 1)
                drawBarGraph(countries,data,currentYear,10)
            }
        })

        var mapZoom = d3.zoom()
        .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
        .translate(350, 260)
        .scale(70);

    svgContainer
        .call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed() {
        var e = d3.event;

        proj
            .translate([e.transform.x-95, e.transform.y-50])
            .scale(e.transform.k);

        svgContainer.selectAll('path')
            .attr('d', gpath);

    }
}

function createMapAbsolute(countries, data, currentYear, svgContainer, svg2, svg4) {
    svgContainer.selectAll("*").remove()
    let countriesOfYear = {}
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == currentYear) {
            let nameOfCountry = element.Team
            countriesOfYear[nameOfCountry] = element;
        }
    })

    const threshHolds = [-60, -40 , -20, -0.001, 0.5 , 20, 40, 60, 60, 200]
    const colors = ["#000080", "#0000e6", "#6483ed", "#b9c8fa","#ffffff", "#ffccf2", "#ff99e6", "#ff33cc", "#cc0099"]
    const widthOfLegendBox = 20
    svgContainer.selectAll(".legend")
        .data(threshHolds)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 600)
        .attr("y", (d, i) => 50 + (i * (widthOfLegendBox)))
        .attr("width", widthOfLegendBox)
        .attr("height", widthOfLegendBox)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("fill", (d, i) => colors[i])

    svgContainer.selectAll("text")
        .data(threshHolds)
        .enter()
        .append("text")
        .attr("x", 1050)
        .attr("y", 400)
        .attr("dy", ".35em");

    svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 517)
        .attr("y", 144 )
        .attr("font-size", "12px")
        .text("No Medals/Tie")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 567)
        .attr("y", 63 )
        .attr("font-size", "12px")
        .text("Male")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 223 )
        .attr("font-size", "12px")
        .text("Female")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 243 )
        .attr("font-size", "12px")
        .text("No Data")
        .attr("text-anchor", "start")
    
    const colorScale = d3.scaleThreshold()
        .domain(threshHolds)
        .range(colors);

    var proj = d3.geoMercator()

    var gpath = d3.geoPath()
        .projection(proj);

        svgContainer.selectAll('path')
        // Get rid of Antartica and French Artic islands
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', gpath)
        .attr('stroke-width', 1)
        .attr('stroke', '#252525')
        .attr('fill', d => {
            if (d.properties.name in countriesOfYear) {
                const colorForCurrentCountry = colorScale((parseFloat(countriesOfYear[d.properties.name].FemaleMedals)-parseFloat(countriesOfYear[d.properties.name].MaleMedals)))
                colorOfCountries[d.properties.name] = colorForCurrentCountry
                return colorForCurrentCountry
            } else {
                colorOfCountries[d.properties.name] = "black"
                return "black"
            }
        })
        .attr("id", d => `drawing-${d.properties.name}`)
        .on("mouseover", function () {
            this.style.cursor = "pointer"
            this.style.fill = hoverColor
            this.setAttribute("stroke-width", 2)
            this.setAttribute("stroke", "white")
            const countryName = this.id.replace("drawing-", "")
            var ratio = "No data for country"
            if(countriesOfYear[countryName] != null){
                   ratio= parseFloat(countriesOfYear[countryName].FemaleMedals)-parseFloat(countriesOfYear[countryName].MaleMedals)
                   if(parseFloat(countriesOfYear[countryName].FemaleMedals) > parseFloat(countriesOfYear[countryName].MaleMedals)
                   & parseFloat(countriesOfYear[countryName].FemaleMedals) !== ratio){
                    ratio = "Women won " + ratio + " medals more"
                   }
                   if(ratio === parseFloat(countriesOfYear[countryName].FemaleMedals) & ratio !== 0){
                    ratio = parseFloat(countriesOfYear[countryName].FemaleMedals) + " and Only Female Won"
                   }
                   if(parseFloat(countriesOfYear[countryName].FemaleMedals) < parseFloat(countriesOfYear[countryName].MaleMedals)
                   & -parseFloat(countriesOfYear[countryName].FemaleMedals) !== ratio){
                    ratio = "Men won " + (-ratio) + " medals more"
                   }
                   if(ratio === -parseFloat(countriesOfYear[countryName].MaleMedals) & ratio !== 0){ //case only men won
                    ratio = -parseFloat(countriesOfYear[countryName].MaleMedals) + " and Only Male Won"
                   }
                   if(ratio === 0 & parseFloat(countriesOfYear[countryName].FemaleMedals) !== 0){
                    ratio = " -> Tie. Male: " + parseFloat(countriesOfYear[countryName].FemaleMedals)
                         + " Female: " + parseFloat(countriesOfYear[countryName].FemaleMedals)
                   }
                   if(ratio===0){
                    ratio = ""
                   }
            }
            toolTipDiv.transition()
                .duration(200)
                .style("opacity", .9)
            if(ratio === "No data for country"){
                toolTipDiv.html(`${countryName}<br/>FemaleMedals - MaleMedals =  ${ratio}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            }
            else{
                toolTipDiv.html(`${countryName}<br/>FemaleMedals - MaleMedals = ${parseFloat(countriesOfYear[countryName].FemaleMedals)-parseFloat(countriesOfYear[countryName].MaleMedals)} ${ratio}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
            }
        })
        .on("mouseout", function () {
            this.setAttribute("stroke-width", 1)
            this.setAttribute("stroke", "black")
            const countryName = this.id.replace("drawing-", "")
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            if (!hasBeenSelected) {
                this.style.fill = colorOfCountries[countryName]
            }
            toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .on("click", function () {
            const countryName = this.id.replace("drawing-", "")
            createAreaChart(data,countryName,svg2)
            createPieGender(data, countryName, currentYear)

            button1.onclick = function(){createPieGender(data, countryName, currentYear)};
            button2.onclick = function(){createPieMedals(data, countryName, currentYear)};
            button1.onmouseover = function(){button1.style.cursor = "pointer"};
            button2.onmouseover = function(){button2.style.cursor = "pointer"};

            const datt = data.filter(d => d.Team === countryName & d.Year === currentYear)[0]
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            this.setAttribute("data-hasBeenSelected", !hasBeenSelected)
            if(!selectedCountries.includes(countryName) & datt.length !==0){
                svg.selectAll(".unselected").style("opacity", .1)
                svg.select("#"+datt.NOC).style("opacity", 1)
                .attr("class", "selected")
                selectedCountries.push(countryName);  
                if(countryName === "United States of America"){
                    svg.select("#United States of America").style("opacity", 1)
                }
                appendCountryBar(data, countries, currentYear)  
            }
            else{
                
                selectedCountries = selectedCountries.filter(contains);

                function contains(country) {
                return country !== countryName;
                }
                svg
                .selectAll("#"+datt.NOC)
                .style("opacity", .1)
                .attr("class", "unselected");
                appendCountryBar(data, countries, currentYear)  

                
            }
            if(selectedCountries.length === 0){
                svg.selectAll(".unselected").style("opacity", 1)
                drawBarGraph(countries,data,currentYear,10)
            }
        })

        var mapZoom = d3.zoom()
        .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
        .translate(350, 260)
        .scale(70);

    svgContainer
        .call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed() {
        var e = d3.event;

        proj
            .translate([e.transform.x-95, e.transform.y-50])
            .scale(e.transform.k);

        svgContainer.selectAll('path')
            .attr('d', gpath);

    }
}


function createMapFemale(countries, data, currentYear, svgContainer, svg2, svg4) {
    svgContainer.selectAll("*").remove()
    let countriesOfYear = {}
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == currentYear) {
            let nameOfCountry = element.Team
            countriesOfYear[nameOfCountry] = element;
        }
    })
    

    const threshHolds = [0.1, 1.5 , 2.5 , 4.5, 8.5, 16.5, 32.5, 64.5, 128.5,300,600]
    const colors = ["#ffffff", "#fff2fa","#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]
    const widthOfLegendBox = 20
    svgContainer.selectAll(".legend")
        .data(threshHolds)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 600)
        .attr("y", (d, i) => 50 + (i * (widthOfLegendBox)))
        .attr("width", widthOfLegendBox)
        .attr("height", widthOfLegendBox)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("fill", (d, i) => colors[i])

    svgContainer.selectAll("text")
        .data(threshHolds)
        .enter()
        .append("text")
        .attr("x", 1000 + 30)
        .attr("y", (d, i) => 50 + (widthOfLegendBox / 2) + (i * (widthOfLegendBox + 10)))
        .attr("dy", ".35em");

    svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 532)
        .attr("y", 63 )
        .attr("font-size", "13px")
        .text("No Medals")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 84 )
        .attr("font-size", "13px")
        .text("1")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 105 )
        .attr("font-size", "13px")
        .text("2")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 126 )
        .attr("font-size", "13px")
        .text("3-4")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 145 )
        .attr("font-size", "13px")
        .text("5-8")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 567)
        .attr("y", 164 )
        .attr("font-size", "13px")
        .text("9-16")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 185 )
        .attr("font-size", "13px")
        .text("17-32")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 206 )
        .attr("font-size", "13px")
        .text("33-64")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 553)
        .attr("y", 226 )
        .attr("font-size", "13px")
        .text("65-128")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 564)
        .attr("y", 245 )
        .attr("font-size", "13px")
        .text("129+")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 548)
        .attr("y", 265 )
        .attr("font-size", "13px")
        .text("No data")
        .attr("text-anchor", "start")

    const colorScale = d3.scaleThreshold()
        .domain(threshHolds)
        .range(colors);

    var proj = d3.geoMercator()

    var gpath = d3.geoPath()
        .projection(proj);

        svgContainer.selectAll('path')
        // Get rid of Antartica and French Artic islands
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', gpath)
        .attr('stroke-width', 1)
        .attr('stroke', '#252525')
        .attr('fill', d => {
            if (d.properties.name in countriesOfYear) {
                const colorForCurrentCountry = colorScale(parseFloat(countriesOfYear[d.properties.name].FemaleMedals))
                colorOfCountries[d.properties.name] = colorForCurrentCountry
                return colorForCurrentCountry
            } else {
                colorOfCountries[d.properties.name] = "black"
                return "black"
            }
        })
        .attr("id", d => `drawing-${d.properties.name}`)
        .on("mouseover", function () {
            this.style.cursor = "pointer"
            this.style.fill = hoverColor
            this.setAttribute("stroke-width", 2)
            this.setAttribute("stroke", "white")
            const countryName = this.id.replace("drawing-", "")
            var ratio = "No data for country"
            if(countriesOfYear[countryName] != null){
                ratio= parseFloat(countriesOfYear[countryName].FemaleMedals)
                if(ratio === -1){ // case no medals for country
                 ratio = "No Medals"
                }
                if(ratio === 0){ //case only men won
                 ratio = "Only Male Won"
                }
                if(ratio === 100){
                 ratio = "Only Female Won"
                }
         }
         toolTipDiv.transition()
             .duration(200)
             .style("opacity", .9)
         toolTipDiv.html(`${countryName}<br/>Female Medals: ${ratio}`)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px")
     })
        .on("mouseout", function () {
            this.setAttribute("stroke-width", 1)
            this.setAttribute("stroke", "black")
            const countryName = this.id.replace("drawing-", "")
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            if (!hasBeenSelected) {
                this.style.fill = colorOfCountries[countryName]
            }
            toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .on("click", function () {
            const countryName = this.id.replace("drawing-", "")
            createAreaChart(data, countryName, svg2)
            createPieGender(data, countryName, currentYear)

            button1.onclick = function(){createPieGender(data, countryName, currentYear)};
            button2.onclick = function(){createPieMedals(data, countryName, currentYear)};

            const datt = data.filter(d => d.Team === countryName & d.Year === currentYear)[0]
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            this.setAttribute("data-hasBeenSelected", !hasBeenSelected)
            if(!selectedCountries.includes(countryName) & datt.length !==0){
                svg.selectAll(".unselected").style("opacity", .1)
                svg.select("#"+datt.NOC).style("opacity", 1)
                .attr("class", "selected")
                selectedCountries.push(countryName);  
                if(countryName === "United States of America"){
                    svg.select("#United States of America").style("opacity", 1)
                }
                appendCountryBar(data, countries, currentYear)  
            }
            else{
                
                selectedCountries = selectedCountries.filter(contains);

                function contains(country) {
                return country !== countryName;
                }
                svg
                .selectAll("#"+datt.NOC)
                .style("opacity", .1)
                .attr("class", "unselected");
                appendCountryBar(data, countries, currentYear)  

                
            }
            if(selectedCountries.length === 0){
                svg.selectAll(".unselected").style("opacity", 1)
                drawBarGraph(countries,data,currentYear,10)
            }
        })

        var mapZoom = d3.zoom()
        .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
        .translate(350, 260)
        .scale(70);

    svgContainer
        .call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed() {
        var e = d3.event;

        proj
            .translate([e.transform.x-95, e.transform.y-50])
            .scale(e.transform.k);

        svgContainer.selectAll('path')
            .attr('d', gpath);

    }
}

function createMapMale(countries, data, currentYear, svgContainer, svg2, svg4) {
    svgContainer.selectAll("*").remove()
    let countriesOfYear = {}
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == currentYear) {
            let nameOfCountry = element.Team
            countriesOfYear[nameOfCountry] = element;
        }
    })

    const threshHolds = [0.1, 1.5 , 2.5 , 4.5, 8.5, 16.5, 32.5, 64.5, 128.5,300,600]
    const colors = ["#f7fbff","#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c","#0b3493", "#08306b"]
    const widthOfLegendBox = 20
    svgContainer.selectAll(".legend")
        .data(threshHolds)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 600)
        .attr("y", (d, i) => 50 + (i * (widthOfLegendBox)))
        .attr("width", widthOfLegendBox)
        .attr("height", widthOfLegendBox)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("fill", (d, i) => colors[i])

    svgContainer.selectAll("text")
        .data(threshHolds)
        .enter()
        .append("text")
        .attr("x", 1000 + 30)
        .attr("y", (d, i) => 50 + (widthOfLegendBox / 2) + (i * (widthOfLegendBox + 10)))
        .attr("dy", ".35em");

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 532)
        .attr("y", 63 )
        .attr("font-size", "13px")
        .text("No Medals")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 84 )
        .attr("font-size", "13px")
        .text("1")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 105 )
        .attr("font-size", "13px")
        .text("2")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 126 )
        .attr("font-size", "13px")
        .text("3-4")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 145 )
        .attr("font-size", "13px")
        .text("5-8")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 567)
        .attr("y", 164 )
        .attr("font-size", "13px")
        .text("9-16")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 185 )
        .attr("font-size", "13px")
        .text("17-32")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 206 )
        .attr("font-size", "13px")
        .text("33-64")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 553)
        .attr("y", 226 )
        .attr("font-size", "13px")
        .text("65-128")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 564)
        .attr("y", 245 )
        .attr("font-size", "13px")
        .text("129+")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 548)
        .attr("y", 265 )
        .attr("font-size", "13px")
        .text("No data")
        .attr("text-anchor", "start")

    const colorScale = d3.scaleThreshold()
        .domain(threshHolds)
        .range(colors);

    var proj = d3.geoMercator()

    var gpath = d3.geoPath()
        .projection(proj);

        svgContainer.selectAll('path')
        // Get rid of Antartica and French Artic islands
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', gpath)
        .attr('stroke-width', 1)
        .attr('stroke', '#252525')
        .attr('fill', d => {
            if (d.properties.name in countriesOfYear) {
                const colorForCurrentCountry = colorScale(parseFloat(countriesOfYear[d.properties.name].MaleMedals))
                colorOfCountries[d.properties.name] = colorForCurrentCountry
                return colorForCurrentCountry
            } else {
                colorOfCountries[d.properties.name] = "black"
                return "black"
            }
        })
        .attr("id", d => `drawing-${d.properties.name}`)
        .on("mouseover", function () {
            this.style.cursor = "pointer"
            this.style.fill = hoverColor
            this.setAttribute("stroke-width", 2)
            this.setAttribute("stroke", "white")
            const countryName = this.id.replace("drawing-", "")
            var ratio = "No data for country"
            if(countriesOfYear[countryName] != null){
                ratio= parseFloat(countriesOfYear[countryName].MaleMedals)
                if(ratio === -1){ // case no medals for country
                 ratio = "No Medals"
                }
                if(ratio === 0){ //case only men won
                 ratio = "Only Male Won"
                }
                if(ratio === 100){
                 ratio = "Only Female Won"
                }
         }
         toolTipDiv.transition()
             .duration(200)
             .style("opacity", .9)
         toolTipDiv.html(`${countryName}<br/>Male Medals: ${ratio}`)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px")
     })
        .on("mouseout", function () {
            this.setAttribute("stroke-width", 1)
            this.setAttribute("stroke", "black")
            const countryName = this.id.replace("drawing-", "")
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            if (!hasBeenSelected) {
                this.style.fill = colorOfCountries[countryName]
            }
            toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .on("click", function () {
            const countryName = this.id.replace("drawing-", "")
            createAreaChart(data, countryName, svg2)
            createPieGender(data, countryName, currentYear)

            button1.onclick = function(){createPieGender(data, countryName, currentYear)};
            button2.onclick = function(){createPieMedals(data, countryName, currentYear)};

            const datt = data.filter(d => d.Team === countryName & d.Year === currentYear)[0]
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            this.setAttribute("data-hasBeenSelected", !hasBeenSelected)
            if(!selectedCountries.includes(countryName) & datt.length !==0){
                svg.selectAll(".unselected").style("opacity", .1)
                svg.select("#"+datt.NOC).style("opacity", 1)
                .attr("class", "selected")
                selectedCountries.push(countryName);  
                if(countryName === "United States of America"){
                    svg.select("#United States of America").style("opacity", 1)
                }
                appendCountryBar(data, countries, currentYear)  
            }
            else{
                
                selectedCountries = selectedCountries.filter(contains);

                function contains(country) {
                return country !== countryName;
                }
                svg
                .selectAll("#"+datt.NOC)
                .style("opacity", .1)
                .attr("class", "unselected");
                appendCountryBar(data, countries, currentYear)  

                
            }
            if(selectedCountries.length === 0){
                svg.selectAll(".unselected").style("opacity", 1)
                drawBarGraph(countries,data,currentYear,10)
            }
        })

    var mapZoom = d3.zoom()
        .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
        .translate(350, 260)
        .scale(70);

    svgContainer
        .call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed() {
        var e = d3.event;

        proj
            .translate([e.transform.x-95, e.transform.y-50])
            .scale(e.transform.k);

        svgContainer.selectAll('path')
            .attr('d', gpath);

    }
}

function createMapTotal(countries, data, currentYear, svgContainer, svg2, svg4) {
    svgContainer.selectAll("*").remove()
    let countriesOfYear = {}
    data.forEach(element => {
        const cYear = element["Year"]
        if (cYear == currentYear) {
            let nameOfCountry = element.Team
            countriesOfYear[nameOfCountry] = element;
        }
    })

    const threshHolds = [0.1, 1.5 , 2.5 , 4.5, 8.5, 16.5, 32.5, 64.5, 128.5,300,600]
    const colors = ["#f7fcf5","#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c","#005113", "#00441b"]
    const widthOfLegendBox = 20
    svgContainer.selectAll(".legend")
        .data(threshHolds)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", 600)
        .attr("y", (d, i) => 50 + (i * (widthOfLegendBox)))
        .attr("width", widthOfLegendBox)
        .attr("height", widthOfLegendBox)
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .style("fill", (d, i) => colors[i])

    svgContainer.selectAll("text")
        .data(threshHolds)
        .enter()
        .append("text")
        .attr("x", 1000 + 30)
        .attr("y", (d, i) => 50 + (widthOfLegendBox / 2) + (i * (widthOfLegendBox + 10)))
        .attr("dy", ".35em");

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 532)
        .attr("y", 63 )
        .attr("font-size", "13px")
        .text("No Medals")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 84 )
        .attr("font-size", "13px")
        .text("1")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 585)
        .attr("y", 105 )
        .attr("font-size", "13px")
        .text("2")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 126 )
        .attr("font-size", "13px")
        .text("3-4")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 575)
        .attr("y", 145 )
        .attr("font-size", "13px")
        .text("5-8")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 567)
        .attr("y", 164 )
        .attr("font-size", "13px")
        .text("9-16")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 185 )
        .attr("font-size", "13px")
        .text("17-32")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 560)
        .attr("y", 206 )
        .attr("font-size", "13px")
        .text("33-64")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 553)
        .attr("y", 226 )
        .attr("font-size", "13px")
        .text("65-128")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 564)
        .attr("y", 245 )
        .attr("font-size", "13px")
        .text("129+")
        .attr("text-anchor", "start")

        svgContainer.append("text")
        .attr("text-anchor", "end")
        .attr("x", 548)
        .attr("y", 265 )
        .attr("font-size", "13px")
        .text("No data")
        .attr("text-anchor", "start")

    const colorScale = d3.scaleThreshold()
        .domain(threshHolds)
        .range(colors);

    var proj = d3.geoMercator()

    var gpath = d3.geoPath()
        .projection(proj);

        svgContainer.selectAll('path')
        // Get rid of Antartica and French Artic islands
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', gpath)
        .attr('stroke-width', 1)
        .attr('stroke', '#252525')
        .attr('fill', d => {
            if (d.properties.name in countriesOfYear) {
                const colorForCurrentCountry = colorScale(parseFloat(countriesOfYear[d.properties.name].TotalMedals))
                colorOfCountries[d.properties.name] = colorForCurrentCountry
                return colorForCurrentCountry
            } else {
                colorOfCountries[d.properties.name] = "black"
                return "black"
            }
        })
        .attr("id", d => `drawing-${d.properties.name}`)
        .on("mouseover", function () {
            this.style.cursor = "pointer"
            this.style.fill = hoverColor
            this.setAttribute("stroke-width", 2)
            this.setAttribute("stroke", "white")
            const countryName = this.id.replace("drawing-", "")
            var ratio = "No data for country"
            if(countriesOfYear[countryName] != null){
                ratio= parseFloat(countriesOfYear[countryName].TotalMedals)
                if(ratio === -1){ // case no medals for country
                 ratio = "No Medals"
                }
                if(ratio === 0){ //case only men won
                 ratio = "Only Male Won"
                }
                if(ratio === 100){
                 ratio = "Only Female Won"
                }
         }
         toolTipDiv.transition()
             .duration(200)
             .style("opacity", .9)
         toolTipDiv.html(`${countryName}<br/>Total Medals: ${ratio}`)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px")
     })
        .on("mouseout", function () {
            this.setAttribute("stroke-width", 1)
            this.setAttribute("stroke", "black")
            const countryName = this.id.replace("drawing-", "")
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            if (!hasBeenSelected) {
                this.style.fill = colorOfCountries[countryName]
            }
            toolTipDiv.transition()
                .duration(500)
                .style("opacity", 0)
        })
        .on("click", function () {
            const countryName = this.id.replace("drawing-", "")
            createAreaChart(data, countryName, svg2)
            createPieGender(data, countryName, currentYear)

            button1.onclick = function(){createPieGender(data, countryName, currentYear)};
            button2.onclick = function(){createPieMedals(data, countryName, currentYear)};

            const datt = data.filter(d => d.Team === countryName & d.Year === currentYear)[0]
            const hasBeenSelected = this.getAttribute("data-hasBeenSelected") === 'true'
            this.setAttribute("data-hasBeenSelected", !hasBeenSelected)
            if(!selectedCountries.includes(countryName) & datt.length !==0){
                svg.selectAll(".unselected").style("opacity", .1)
                svg.select("#"+datt.NOC).style("opacity", 1)
                .attr("class", "selected")
                selectedCountries.push(countryName);  
                if(countryName === "United States of America"){
                    svg.select("#United States of America").style("opacity", 1)
                }
                appendCountryBar(data, countries, currentYear)  
            }
            else{
                
                selectedCountries = selectedCountries.filter(contains);

                function contains(country) {
                return country !== countryName;
                }
                svg
                .selectAll("#"+datt.NOC)
                .style("opacity", .1)
                .attr("class", "unselected");
                appendCountryBar(data, countries, currentYear)  

                
            }
            if(selectedCountries.length === 0){
                svg.selectAll(".unselected").style("opacity", 1)
                drawBarGraph(countries,data,currentYear,10)
            }
        })

        var mapZoom = d3.zoom()
        .on('zoom', zoomed);

        var zoomSettings = d3.zoomIdentity
        .translate(350, 260)
        .scale(70);

    svgContainer
        .call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed() {
        var e = d3.event;

        proj
            .translate([e.transform.x-95, e.transform.y-50])
            .scale(e.transform.k);

        svgContainer.selectAll('path')
            .attr('d', gpath);

    }
}