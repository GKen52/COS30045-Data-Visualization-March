const donutSetup = () => {
    const container = d3.select("#donut-chart");
    container.html("");

    const svg = container
        .append("svg")
        .attr("viewBox", "0 0 900 450")
        .style("border", "1px solid #ddd")
        .style("border-radius", "8px")
        .style("background", "#fff");

    const width = 900;
    const height = 450;
    const radius = Math.min(width, height) / 2 - 50;

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2 - 80},${height / 2})`);

    d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv", d => {
        return {
            tech: d.Screen_Tech,
            energy: +d["Mean(Labelled energy consumption (kWh/year))"]
        };
    }).then(data => {
        console.log("Donut data loaded:", data);

        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.tech))
            .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

        const pie = d3.pie()
            .value(d => d.energy)
            .sort(null)
            .padAngle(0.03);

        const arc = d3.arc()
            .innerRadius(radius * 0.55)
            .outerRadius(radius);

        const labelArc = d3.arc()
            .innerRadius(radius * 0.8)
            .outerRadius(radius * 0.8);

        const arcs = g.selectAll(".arc")
            .data(pie(data))
            .join("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.tech))
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .style("cursor", "pointer")
            .append("title")
            .text(d => `${d.data.tech}: ${Math.round(d.data.energy)} kWh/year (${Math.round(d.endAngle - d.startAngle)}°)`);

        arcs.append("text")
            .attr("transform", d => `translate(${labelArc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(d => d.data.tech);

        const total = d3.sum(data, d => d.energy);
        arcs.append("text")
            .attr("transform", d => `translate(${labelArc.centroid(d)})`)
            .attr("dy", "1.4em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(d => `${Math.round((d.data.energy / total) * 100)}%`);

        const legend = svg.append("g")
            .attr("transform", `translate(${width / 2 + radius - 20}, ${height / 2 - (data.length * 25)})`);

        data.forEach((d, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 30})`);

            row.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("rx", 3)
                .attr("fill", colorScale(d.tech));

            row.append("text")
                .attr("x", 28)
                .attr("y", 9)
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "#333")
                .text(`${d.tech}: ${Math.round(d.energy)} kWh/year`);
        });

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.2em")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Total");

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em")
            .style("font-size", "14px")
            .style("fill", "#666")
            .text(`${Math.round(total)} kWh/year`);

    }).catch(err => {
        console.error("Donut chart CSV load failed:", err);
        d3.select("#donut-chart").append("p")
            .style("color", "red")
            .style("padding", "20px")
            .text("Error loading donut chart data.");
    });
};

donutSetup();
