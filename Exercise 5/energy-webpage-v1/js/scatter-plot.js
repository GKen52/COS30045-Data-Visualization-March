const scatterSetup = () => {
    const container = d3.select("#scatter-chart");
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

    d3.csv("data/Ex5_TV_energy.csv", d => {
        return {
            energy: +d.energy_consumpt,
            star: +d.star2,
            tech: d.screen_tech,
            size: +d.screensize,
            count: +d.count
        };
    }).then(data => {
        console.log("Scatter data loaded:", data.length, "rows");
        console.log("Extent energy:", d3.extent(data, d => d.energy));
        console.log("Extent star:", d3.extent(data, d => d.star));


        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.star) + 0.5])
            .range([0, width])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy) + 100])
            .range([height, 0])
            .nice();

        const colorScale = d3.scaleOrdinal()
            .domain(["LCD", "LCD (LED)", "OLED"])
            .range(["#4CAF50", "#2196F3", "#FF9800"]);

        g.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat("")
            )
            .call(g => g.select(".domain").remove())
            .selectAll("line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "3,3");

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

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10))
            .selectAll("text")
            .style("font-size", "12px")
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
            .text("Star Rating (Energy Efficiency)");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#333")
            .style("font-weight", "bold")
            .text("Energy Consumption (kWh/year)");

        g.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => xScale(d.star))
            .attr("cy", d => yScale(d.energy))
            .attr("r", 5)
            .attr("fill", d => colorScale(d.tech))
            .attr("opacity", 0.6)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .style("cursor", "pointer")
            .append("title")
            .text(d => `${d.tech} ${d.size}"\nEnergy: ${d.energy} kWh/year\nStars: ${d.star}`);

        const legendData = ["LCD", "LCD (LED)", "OLED"];
        const legend = d3.select("#scatter-legend");

        legendData.forEach((tech, i) => {
            const item = legend.append("div").attr("class", "legend-item");
            item.append("span")
                .attr("class", "legend-color")
                .style("background-color", colorScale(tech));
            item.append("span").text(tech);
        });

    }).catch(err => {
        console.error("Scatter plot CSV load failed:", err);
        d3.select("#scatter-chart").append("p")
            .style("color", "red")
            .style("padding", "20px")
            .text("Error loading scatter plot data.");
    });
};

scatterSetup();
