// Simple navigation script
document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('.logo')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Load CSV data for the televisions page
    const tvTable = document.querySelector('#tv-table');
    if (tvTable) {
        loadTelevisionData(tvTable);
    }
});

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(line => line.length > 0);
    return lines.map(line => line.split(',').map(cell => cell.trim()));
}

function loadTelevisionData(table) {
    fetch('./data/data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Unable to load CSV: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            const rows = parseCSV(text);
            const header = rows.shift();
            const indices = {
                appliance: header.indexOf('Appliance'),
                type: header.indexOf('Type'),
                sizePower: header.indexOf('Size/Power'),
                annualCost: header.indexOf('Annual Cost (AUD)'),
                energyRating: header.indexOf('Energy Rating')
            };

            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';

            const tvRows = rows.filter(values => values[indices.appliance] === 'Television');
            if (tvRows.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">No television data found in data.csv.</td></tr>';
                return;
            }

            tvRows.forEach(values => {
                const row = document.createElement('tr');
                const type = values[indices.type] || '';
                const size = values[indices.sizePower] || '';
                const cost = values[indices.annualCost] ? `$${values[indices.annualCost]}` : '';
                const rating = values[indices.energyRating] ? `${values[indices.energyRating]} stars` : '';

                row.innerHTML = `
                    <td>${type}</td>
                    <td>${size}</td>
                    <td>${cost}</td>
                    <td>${rating}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = `<tr><td colspan="4">Error loading data: ${error.message}</td></tr>`;
            console.error(error);
        });
}
