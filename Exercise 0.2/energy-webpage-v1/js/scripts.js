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
});
