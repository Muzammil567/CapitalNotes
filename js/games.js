// Game data
const games = [
    {
        id: 'memory-match',
        title: 'Memory Match',
        description: 'Test your memory by matching pairs of cards in this classic concentration game.',
        category: 'puzzle',
        icon: '🎴',
        color: 'linear-gradient(135deg, #6366f1, #a855f7)'
    },
    {
        id: 'snake-game',
        title: 'Snake Game',
        description: 'Guide the snake to eat food and grow longer while avoiding collisions.',
        category: 'arcade',
        icon: '🐍',
        color: 'linear-gradient(135deg, #22c55e, #10b981)'
    },
    {
        id: 'tetris',
        title: 'Tetris',
        description: 'Arrange falling blocks to create complete lines in this timeless puzzle game.',
        category: 'puzzle',
        icon: '🟦',
        color: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
    },
    {
        id: 'whack-a-mole',
        title: 'Whack-a-Mole',
        description: 'Test your reflexes by whacking moles as they pop up from their holes.',
        category: 'arcade',
        icon: '🔨',
        color: 'linear-gradient(135deg, #f97316, #fb923c)'
    },
    {
        id: 'math-quiz',
        title: 'Math Quiz',
        description: 'Challenge your math skills with various arithmetic problems.',
        category: 'educational',
        icon: '🔢',
        color: 'linear-gradient(135deg, #ec4899, #f472b6)'
    },
    {
        id: 'word-scramble',
        title: 'Word Scramble',
        description: 'Unscramble letters to form words and improve your vocabulary.',
        category: 'educational',
        icon: '📝',
        color: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    },
    {
        id: 'chess',
        title: 'Chess',
        description: 'Play the classic game of strategy against an AI opponent.',
        category: 'strategy',
        icon: '♟️',
        color: 'linear-gradient(135deg, #64748b, #94a3b8)'
    },
    {
        id: 'tic-tac-toe',
        title: 'Tic Tac Toe',
        description: "Play the classic game of X's and O's against a friend or AI.",
        category: 'strategy',
        icon: '⭕',
        color: 'linear-gradient(135deg, #f43f5e, #fb7185)'
    }
];

// DOM Elements
const gamesGrid = document.querySelector('.games-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// Create game card element
function createGameCard(game) {
    const card = document.createElement('a');
    card.href = `${game.id}.html`;
    card.className = 'game-card';
    card.setAttribute('data-category', game.category);
    
    card.innerHTML = `
        <div class="game-icon" style="color: ${game.color}">${game.icon}</div>
        <span class="game-tag">${game.category}</span>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
    `;
    
    return card;
}

// Filter games by category
function filterGames(category) {
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize games grid
function initGamesGrid() {
    games.forEach(game => {
        const card = createGameCard(game);
        gamesGrid.appendChild(card);
    });
}

// Add filter button click handlers
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter games
        const category = button.dataset.category;
        filterGames(category);
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initGamesGrid();
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 