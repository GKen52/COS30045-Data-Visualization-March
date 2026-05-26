# Energy Saver Australia

A web application providing information about appliance energy consumption in the Australian market, helping households make informed decisions to reduce their electricity usage and costs.

## Project Structure

```
energy-webpage-v1/
│
├── css/
│   └── styles.css          # Main stylesheet with responsive design
│
├── js/
│   └── scripts.js          # JavaScript for navigation and interactions
│
├── images/
│   └── PowerIcon.png       # Website logo (green-to-blue gradient)
│
├── data/
│   └── data.csv            # Appliance energy consumption data
│
├── index.html              # Home page
├── televisions.html        # Television energy data page
├── about.html              # About Us page
└── README.md               # This file
```

## Features

### Navigation
- **Top navigation menu** on all three pages
- **Power logo** in top-left corner - click to return to Home page
- **Mouse over feedback** on navigation links (hover effects)
- **Current page indicator** - active page is highlighted
- **Responsive design** - works on desktop and mobile devices

### Pages
1. **Home (index.html)**
   - Welcome hero section
   - Energy saving tips for Australian homes
   - Information cards about home energy usage
   - Key statistics and facts

2. **Televisions (televisions.html)**
   - Comprehensive energy consumption data table
   - TV types: LED LCD, OLED, QLED, Plasma
   - Screen sizes from 32" to 77"
   - Annual energy usage and cost calculations
   - Energy star ratings
   - Buying tips for energy-efficient TVs

3. **About Us (about.html)**
   - Mission statement
   - Australian energy market context
   - Energy efficiency importance
   - Project information
   - Developer details

### Styling
- **Color scheme** matching the PowerIcon logo:
  - Primary Green: #2E7D32
  - Primary Blue: #1565C0
  - Gradient backgrounds combining both colors
- **Modern, clean design** with card-based layout
- **Smooth animations** and transitions
- **Responsive breakpoints** for mobile devices

### Footer
- Displays current year (2026)
- Developer name: Kennard Chan
- Copyright information

## Technical Details

### CSS Features
- Flexbox and Grid layouts
- CSS animations and transitions
- Media queries for responsiveness
- Custom properties for maintainability
- Gradient backgrounds
- Box shadows for depth

### JavaScript Features
- Current page detection and highlighting
- Logo click handler for home navigation
- Smooth page transitions
- Notification system
- CSV data loading functionality

### Data
The `data/data.csv` file contains energy consumption information for various appliances including:
- Televisions (LED, OLED, QLED, Plasma)
- Refrigerators
- Washing Machines
- Dishwashers
- Air Conditioners
- Dryers
- Kitchen Appliances
- Electronics

## Usage

1. Open `index.html` in a web browser
2. Navigate between pages using the top menu
3. Click the Power logo to return to Home at any time
4. View energy consumption data on the Televisions page
5. Learn more about the project on the About Us page

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Author

**Kennard Chan**
- Created: 2026
- Project: Energy Saver Australia Website

## License

This project is for educational purposes.

## Acknowledgments

- Energy consumption data sourced from Australian Government Energy Rating website
- Icons and design inspiration from modern web design practices
- Color scheme based on eco-friendly energy themes
