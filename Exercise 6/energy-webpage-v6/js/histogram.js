const drawHistogram = (data) => {
    // Set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid #ddd")
        .style("border-radius", "8px")
        .style("background", bodyBackgroundColor);

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const bins = binGenerator(data);  
    console.log("Histogram bins:", bins);

    const minEng = bins[0].x0; 
    const maxEng = bins[bins.length - 1].x1;  
    const binsMaxLength = d3.max(bins, d => d.length);  

    xScale
        .domain([0, maxEng])  
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice(); 

    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)  
        .attr("stroke-width", 2)
        .attr("class", "hist-bar")
        .on("mouseenter", function(e, d) {
            d3.select(this)
                .attr("fill", "#C46A1A");  

            let tooltip = d3.select("#histogram-tooltip");
            if (tooltip.empty()) {
                tooltip = d3.select("body").append("div")
                    .attr("id", "histogram-tooltip")
                    .style("position", "absolute")
                    .style("background", "rgba(0,0,0,0.8)")
                    .style("color", "white")
                    .style("padding", "8px 12px")
                    .style("border-radius", "4px")
                    .style("font-size", "12px")
                    .style("pointer-events", "none")
                    .style("opacity", 0)
                    .style("z-index", 1000);
            }

            const techs = [...new Set(d.map(item => item.screenTech))];
            const techCounts = {};
            d.forEach(item => {
                techCounts[item.screenTech] = (techCounts[item.screenTech] || 0) + 1;
            });

            let techHtml = techs.map(t => {
                const color = colorScale(t) || "#999";
                return `<span style="color:${color}">●</span> ${t}: ${techCounts[t]}`;
            }).join("<br>");

            tooltip.html(`
                <strong>Energy: ${Math.round(d.x0)} - ${Math.round(d.x1)} kWh/year</strong><br>
                Count: ${d.length}<br>
                ${techHtml}
            `)
            .style("left", (e.pageX + 10) + "px")
            .style("top", (e.pageY - 10) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1);
        })
        .on("mousemove", function(e, d) {
            d3.select("#histogram-tooltip")
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY - 10) + "px");
        })
        .on("mouseleave", function(e, d) {
            d3.select(this)
                .attr("fill", barColor);

            d3.select("#histogram-tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });


    const bottomAxis = d3.axisBottom(xScale)
        .ticks(10)
        .tickFormat(d => d >= 1000 ? (d/1000).toFixed(1) + "k" : d);

    // Add the x-axis to the bottom of the chart relative to the inner chart
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis)
        .attr("class", "x-axis")
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#555");

    // Add x-axis line styling
    innerChart.select(".x-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    innerChart.selectAll(".x-axis line")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);

    // Add the x-axis label
    svg.append("text")
        .text("Labelled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScale);

    // Add the y-axis to the left of the chart relative to the inner chart
    innerChart
        .append("g")
        .call(leftAxis)
        .attr("class", "y-axis")
        .selectAll("text")
        .style("font-size", "11px")
        .style("fill", "#555");

    // Add y-axis line styling
    innerChart.select(".y-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    innerChart.selectAll(".y-axis line")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);

    svg.append("text")
        .text("Frequency")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");
};