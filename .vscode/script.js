// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Optional: change button icon (e.g., to X)
            const isActive = navLinks.classList.contains('active');
            menuBtn.textContent = isActive ? '✕' : '☰';
        });

        // Close menu when a link is clicked (smooth scroll + hide menu)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                // If it's an anchor link, handle smooth scroll
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Adjust for header height
                            behavior: 'smooth'
                        });
                    }
                }
                // Close menu on mobile after clicking
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    menuBtn.textContent = '☰';
                }
            });
        });
    }

    // Optional: Add a simple console log to confirm JS is loaded
    console.log('AXEL\'S GPR site loaded successfully.');
});