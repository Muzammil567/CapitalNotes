// Common functionality for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    
    // Handle mobile menu
    initializeMobileMenu();
    
    // Handle achievements
    initializeAchievements();
});

function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initializeMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.nav-links');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuButton.setAttribute('aria-expanded', 
                menuButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });
    }
}

function initializeAchievements() {
    window.showAchievement = (message) => {
        const achievement = document.createElement('div');
        achievement.className = 'achievement';
        achievement.textContent = message;
        document.body.appendChild(achievement);
        
        // Trigger animation
        setTimeout(() => achievement.classList.add('show'), 100);
        
        // Remove after animation
        setTimeout(() => {
            achievement.classList.remove('show');
            setTimeout(() => achievement.remove(), 300);
        }, 3000);
    };
}

// Handle service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
            console.log('New content is available; please refresh.');
            // You could show a notification to the user here
        }
    });
}

// Export common game utilities
window.gameUtils = {
    // Generate random number between min and max (inclusive)
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Shuffle array
    shuffle: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },
    
    // Format time (seconds) to MM:SS
    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    // Save high score
    saveHighScore: (gameName, score) => {
        const highScores = JSON.parse(localStorage.getItem('highScores') || '{}');
        if (!highScores[gameName] || score > highScores[gameName]) {
            highScores[gameName] = score;
            localStorage.setItem('highScores', JSON.stringify(highScores));
            return true; // New high score
        }
        return false;
    },
    
    // Get high score
    getHighScore: (gameName) => {
        const highScores = JSON.parse(localStorage.getItem('highScores') || '{}');
        return highScores[gameName] || 0;
    }
};

