// Common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Newsletter form validation
    window.validateForm = function(event) {
        const form = event.target;
        const emailInput = form.querySelector('input[type="email"]');
        
        if (!emailInput.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)) {
            alert('Please enter a valid email address');
            return false;
        }
        
        // Prevent multiple submissions
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        // Here you would typically handle the form submission
        // For now, we'll just simulate success
        setTimeout(() => {
            alert('Thank you for subscribing!');
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe';
        }, 1000);
        
        return false; // Prevent actual form submission
    };

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }

    // Handle service worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
}); 