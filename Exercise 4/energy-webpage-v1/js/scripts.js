document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelector('.logo')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    let currentPage = window.location.pathname.split('/').pop();
    
    if (!currentPage || currentPage === '') {
        currentPage = 'index.html';
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    if (currentPage === 'televisions.html') {
        loadTVData();
    }
});

// Load TV data from CSV
function loadTVData() {
    
    const csvPath = './data/data.csv';
    
    fetch(csvPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('CSV file not found');
            }
            return response.text();
        })
        .then(data => {
            const rows = data.trim().split('\n').slice(1);
            const tbody = document.querySelector('#tv-table tbody');
            
            if (!tbody) return;
            
            tbody.innerHTML = '';
            
            rows.forEach(row => {
                if (!row.trim()) return;
                
                const cols = row.split(',');
                
                if (cols[0] === 'Television') {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cols[1]}</td>
                        <td>${cols[2]}</td>
                        <td>${cols[3]}</td>
                        <td>$${cols[4]}</td>
                        <td>${cols[5]} stars</td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        })
        .catch(error => {
            console.log('Error loading CSV:', error);
        });
}
