const populateFilters = (data) => {

    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            if (!d.isActive) {
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });

                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false);

                updateHistogram(d.id, data);
            }
        });
};

const updateHistogram = (filterId, data) => {

    const updatedData = filterId === "all"
        ? data
        : data.filter(tv => tv.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);


    const rawMax = updatedBins.length > 0 ? updatedBins[updatedBins.length - 1].x1 : 1800;
    const maxEng = Math.min(rawMax, 1800);  
    xScale.domain([0, maxEng]);

    const binsMaxLength = d3.max(updatedBins, d => d.length) || 0;
    yScale.domain([0, binsMaxLength]).nice();

    const svg = d3.select("#histogram svg");

    svg.select("g.x-axis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => d >= 1000 ? (d/1000).toFixed(1) + "k" : d));

    svg.select("g.x-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    svg.selectAll("g.x-axis line")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);
    svg.selectAll("g.x-axis text")
        .style("font-size", "11px")
        .style("fill", "#555");

    svg.select("g.y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));

    svg.select("g.y-axis path")
        .attr("stroke", "#333")
        .attr("stroke-width", 1);
    svg.selectAll("g.y-axis line")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);
    svg.selectAll("g.y-axis text")
        .style("font-size", "11px")
        .style("fill", "#555");

    const bars = svg.select("g")  
        .selectAll("rect")
        .data(updatedBins);

    bars.exit()
        .transition()
        .duration(300)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();

    bars.transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => innerHeight - yScale(d.length));

    bars.enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", innerHeight)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", 0)
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2)
        .attr("class", "hist-bar")
        .on("mouseenter", function(e, d) {
            d3.select(this).attr("fill", "#C46A1A");
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
            d.forEach(item => { techCounts[item.screenTech] = (techCounts[item.screenTech] || 0) + 1; });
            let techHtml = techs.map(t => {
                const color = colorScale(t) || "#999";
                return `<span style="color:${color}">●</span> ${t}: ${techCounts[t]}`;
            }).join("<br>");
            tooltip.html(`<strong>Energy: ${Math.round(d.x0)} - ${Math.round(d.x1)} kWh/year</strong><br>Count: ${d.length}<br>${techHtml}`)
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY - 10) + "px")
                .transition().duration(200).style("opacity", 1);
        })
        .on("mousemove", function(e) {
            d3.select("#histogram-tooltip")
                .style("left", (e.pageX + 10) + "px")
                .style("top", (e.pageY - 10) + "px");
        })
        .on("mouseleave", function(e, d) {
            d3.select(this).attr("fill", barColor);
            d3.select("#histogram-tooltip").transition().duration(200).style("opacity", 0);
        })
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};

const createTooltip = () => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);  

    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", "#333")  
        .attr("fill-opacity", 0.85);

    tooltip
        .append("text")
        .text("N/A")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-weight", 900);
};

const handleMouseEvents = () => {

    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);

            const techColor = colorScale(d.screenTech);

            d3.select(".tooltip rect")
                .attr("fill", techColor); 

            d3.select(".tooltip text")
                .text(d.screenSize + '"');  

            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");

            d3.select(".tooltip")
                .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
                .transition()
                .duration(200)
                .style("opacity", 1);

            d3.select(e.target)
                .attr("r", 6)
                .attr("opacity", 1)
                .attr("stroke", "#333")
                .attr("stroke-width", 2)
                .attr("fill", techColor);  
        })
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);

            d3.select(".tooltip")
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)"); 

            const originalColor = colorScale(d.screenTech);
            d3.select(e.target)
                .attr("r", 4)
                .attr("opacity", 0.5)
                .attr("stroke", "none")
                .attr("fill", originalColor);  
        });
};