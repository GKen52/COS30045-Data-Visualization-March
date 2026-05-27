const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 900;  
const height = 450; 
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

let innerChartS;
const tooltipWidth = 65;
const tooltipHeight = 32;

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)  
    .thresholds(30);                   

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

const colorScale = d3.scaleOrdinal();

const barColor = "#E8913A";
const bodyBackgroundColor = "#fffaf0";

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];
