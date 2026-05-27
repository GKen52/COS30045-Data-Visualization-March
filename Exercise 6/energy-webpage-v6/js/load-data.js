d3.csv("data/Ex6_TVdata.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,        
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,  
    star: +d.star                    
})).then(data => {
    // Log the processed data to the console
    console.log("Data loaded:", data);
    console.log("Number of rows:", data.length);

    // Call functions after data is loaded
    drawHistogram(data);
    drawScatterplot(data);
    populateFilters(data);
    createTooltip();
    handleMouseEvents();

}).catch(error => {
    console.error("Error loading the CSV file:", error);
});