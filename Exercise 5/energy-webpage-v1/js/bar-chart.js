const barSetup = () => {
    const container = d3.select("#bar-chart");
    container.html("");

    const svg = container
        .append("svg")
        .attr("viewBox", "0 0 900 450")
        .style("border", "1px solid #ddd")
        .style("border-radius", "8px")
        .style("background", "#fff");

    const margin = {top: 30, right: 30, bottom: 55, left: 70};
    const width = 900 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv", d => {
        return {
            tech: d.Screen_Tech,
            energy: +d["Mean(Labelled energy consumption (kWh/year))"]
        };
    }).then(data => {
        console.log("Bar data loaded:", data);

   
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.tech))
            .range([0, width])
            .padding(0.35);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy) + 50])
            .range([height, 0])
            .nice();

        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.tech))
            .range(["#5F9EA0", "#4682B4", "#2E8B57"]);

   
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat("")
            )
            .call(g => g.select(".domain").remove())
            .selectAll("line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3");

        // Axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("font-size", "13px")
            .style("fill", "#555");

        g.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#555");

    
        g.append("text")
            .attr("x", width / 2)
            .attr("y", height + 45)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#333")
            .style("font-weight", "bold")
            .text("Screen Technology");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#333")
            .style("font-weight", "bold")
            .text("Mean Energy Consumption (kWh/year)");

       
        g.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => xScale(d.tech))
            .attr("y", height)
            .attr("width", xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d => colorScale(d.tech))
            .attr("rx", 4)
            .attr("ry", 4)
            .transition()
            .duration(800)
            .attr("y", d => yScale(d.energy))
            .attr("height", d => height - yScale(d.energy));

   
        g.selectAll(".label")
            .data(data)
            .join("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.tech) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.energy) - 8)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(d => Math.round(d.energy));

    }).catch(err => {
        console.error("Bar chart CSV load failed:", err);
        d3.select("#bar-chart").append("p")
            .style("color", "red")
            .style("padding", "20px")
            .text("Error loading bar chart data.");
    });
};

barSetup();
