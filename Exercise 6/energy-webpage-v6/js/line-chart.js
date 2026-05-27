const lineSetup = () => {
    const container = d3.select("#line-chart");
    container.html("");

    const svg = container
        .append("svg")
        .attr("viewBox", "0 0 900 450")
        .style("border", "1px solid #ddd")
        .style("border-radius", "8px")
        .style("background", "#fff");

    const margin = {top: 30, right: 90, bottom: 55, left: 70};
    const width = 900 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("data/Ex5_ARE_Spot_Prices.csv", d => {
        return {
            year: +d.Year,
            avg: +d["Average Price (notTas-Snowy)"]
        };
    }).then(data => {
        console.log("Line data loaded:", data.length, "rows");
        console.log("Extent year:", d3.extent(data, d => d.year));
        console.log("Extent avg:", d3.extent(data, d => d.avg));

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width])
            .nice();

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.avg) + 20])
            .range([height, 0])
            .nice();

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
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
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
            .text("Year");

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "#333")
            .style("font-weight", "bold")
            .text("Price ($ per megawatt hour)");

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.avg))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#E91E63")
            .attr("stroke-width", 2.5)
            .attr("d", line);

        g.selectAll(".dot")
            .data(data)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.avg))
            .attr("r", 3)
            .attr("fill", "#E91E63")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .append("title")
            .text(d => `${d.year}: $${d.avg.toFixed(2)} / MWh`);

        const last = data[data.length - 1];
        g.append("text")
            .attr("x", xScale(last.year) + 10)
            .attr("y", yScale(last.avg))
            .attr("dy", "0.35em")
            .attr("fill", "#E91E63")
            .style("font-size", "13px")
            .style("font-weight", "bold")
            .text("Average");

    }).catch(err => {
        console.error("Line chart CSV load failed:", err);
        d3.select("#line-chart").append("p")
            .style("color", "red")
            .style("padding", "20px")
            .text("Error loading line chart data.");
    });
};

lineSetup();
