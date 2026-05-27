const drawScatterplot = (data) => {
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid #ddd")
        .style("border-radius", "8px")
        .style("background", bodyBackgroundColor);

    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    xScaleS
        .domain([0, d3.max(data, d => d.star) + 0.5])
        .range([0, innerWidth])
        .nice();

    yScaleS
        .domain([0, d3.max(data, d => d.energyConsumption) + 100])
        .range([innerHeight, 0])
        .nice();

    const techColors = {
        "LCD (LED)": "#2196F3",  
        "LCD": "#4CAF50",       
        "OLED": "#FF9800"        
    };

    colorScale
        .domain(["LCD (LED)", "LCD", "OLED"]) 
        .range(["#2196F3", "#4CAF50", "#FF9800"]);

    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5) 
        .attr("class", "scatter-point")
        .attr("data-tech", d => d.screenTech); 
    const bottomAxisS = d3.axisBottom(xScaleS);
    innerChartS
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxisS)
        .attr("class", "x-axis")
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#555");

    innerChartS.select(".x-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxisS = d3.axisLeft(yScaleS);
    innerChartS
        .append("g")
        .call(leftAxisS)
        .attr("class", "y-axis")
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#555");

    innerChartS.select(".y-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    svg.append("text")
        .text("Energy Consumption (kWh/year)")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("class", "axis-label");

    const legendData = ["LCD (LED)", "LCD", "OLED"];
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, 30)`);

    legendData.forEach((tech, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        row.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(tech));

        row.append("text")
            .attr("x", 18)
            .attr("y", 6)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", "#333")
            .text(tech);
    });
};