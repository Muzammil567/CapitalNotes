document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const pairsElement = document.getElementById('pairs');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('restart-game');
    const tipElement = document.getElementById('current-tip');

    // Game state
    const emojis = ['💰', '💳', '💎', '📈', '🏦', '💵', '🪙', '📊'];
    const allEmojis = [...emojis, ...emojis];
    let cards = [];
    let flippedCards = [];
    let score = 0;
    let moves = 0;
    let pairsFound = 0;
    let timer = 0;
    let timerInterval;
    let isGameActive = false;

    // Tips for memory improvement
    const tips = [
        "Try to create patterns with card positions",
        "Focus on remembering a few cards at a time",
        "Take your time - accuracy is better than speed",
        "Use the card positions to create mental markers",
        "Look for pairs that are close to each other"
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(emoji) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        card.setAttribute('tabindex', '0');  // Make cards keyboard-accessible
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard.call(card);
            }
        });
        // Add touch support
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            flipCard.call(card);
        });
        return card;
    }

    function flipCard() {
        if (!isGameActive || this.classList.contains('flipped')) return;
        if (flippedCards.length < 2) {
            this.classList.add('flipped');
            this.textContent = this.dataset.emoji;
            flippedCards.push(this);
            
            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.emoji === card2.dataset.emoji;

        if (match) {
            score += 10;
            pairsFound++;
            scoreElement.textContent = score;
            pairsElement.textContent = pairsFound;
            
            if (pairsFound === emojis.length) {
                endGame();
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            score = Math.max(0, score - 1);
            scoreElement.textContent = score;
        }
        
        flippedCards = [];
        showRandomTip();
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        clearInterval(timerInterval);  // Clear any existing timer
        timerInterval = setInterval(() => {
            timer++;
            timerElement.textContent = formatTime(timer);
        }, 1000);
    }

    function showRandomTip() {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        tipElement.textContent = randomTip;
    }

    function endGame() {
        isGameActive = false;
        clearInterval(timerInterval);
        const finalTime = formatTime(timer);
        
        // Save high score
        const currentHighScore = localStorage.getItem('memoryHighScore') || 0;
        if (score > currentHighScore) {
            localStorage.setItem('memoryHighScore', score);
        }
        
        setTimeout(() => {
            alert(`Congratulations! You won!\nTime: ${finalTime}\nMoves: ${moves}\nScore: ${score}\nHigh Score: ${Math.max(score, currentHighScore)}`);
        }, 500);
    }

    function initGame() {
        // Reset game state
        gameBoard.innerHTML = '';
        score = 0;
        moves = 0;
        pairsFound = 0;
        timer = 0;
        flippedCards = [];
        clearInterval(timerInterval);
        
        // Update display
        scoreElement.textContent = score;
        movesElement.textContent = moves;
        pairsElement.textContent = pairsFound;
        timerElement.textContent = formatTime(timer);
        
        // Create and shuffle cards
        cards = shuffleArray(allEmojis).map(createCard);
        cards.forEach(card => gameBoard.appendChild(card));
        
        // Start game
        isGameActive = true;
        startTimer();
        showRandomTip();
    }

    // Event listeners
    resetButton.addEventListener('click', initGame);

    // Initialize the game
    initGame();
});

