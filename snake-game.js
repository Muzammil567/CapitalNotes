class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.tipElement = document.getElementById('current-tip');
        
        // Game buttons
        this.startButton = document.getElementById('start-game');
        this.pauseButton = document.getElementById('pause-game');
        this.restartButton = document.getElementById('restart-game');
        
        // Game settings
        this.gridSize = 20;
        this.gameSpeed = 100;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Setup canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Touch controls
        this.touchStartX = null;
        this.touchStartY = null;
        
        // Financial elements
        this.coins = [];
        this.powerUps = [];
        this.tips = [
            "Save early and save often!",
            "Diversify your investments",
            "Create an emergency fund",
            "Track your spending",
            "Invest in your future"
        ];
        
        // Initialize game state
        this.reset();
        this.setupEventListeners();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerStyle = window.getComputedStyle(container);
        const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
        const paddingY = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
        
        // Make canvas size responsive to container
        const maxWidth = container.clientWidth - paddingX;
        const maxHeight = Math.min(window.innerHeight * 0.6, 600);
        
        // Ensure dimensions are multiples of grid size
        this.canvas.width = Math.floor(maxWidth / this.gridSize) * this.gridSize;
        this.canvas.height = Math.floor(maxHeight / this.gridSize) * this.gridSize;
        
        // Redraw if game is active
        if (this.gameLoop) {
            this.draw();
        }
    }
    
    reset() {
        // Snake initial state - start in the middle, moving right
        const startX = Math.floor(this.canvas.width / this.gridSize / 2);
        const startY = Math.floor(this.canvas.height / this.gridSize / 2);
        this.snake = [{x: startX, y: startY}];
        this.direction = {x: 1, y: 0};  // Start moving right
        this.nextDirection = {x: 1, y: 0};
        this.score = 0;
        this.coins = [];
        this.powerUps = [];
        this.gameLoop = null;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Generate initial coins
        this.generateCoin();
        this.updateScore();
        this.showRandomTip();
        
        // Save high score
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('snakeHighScore', this.score);
        }
    }
    
    setupEventListeners() {
        // Control buttons
        this.startButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                    break;
                case 'ArrowDown':
                    if (this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                    break;
                case 'ArrowLeft':
                    if (this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                    break;
                case 'ArrowRight':
                    if (this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });
        
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!this.touchStartX || !this.touchStartY || this.isGameOver) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - this.touchStartX;
            const dy = touchEndY - this.touchStartY;
            
            // Determine swipe direction based on the larger movement
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
                else if (dx < 0 && this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
            } else {
                if (dy > 0 && this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                else if (dy < 0 && this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
            }
            
            this.touchStartX = null;
            this.touchStartY = null;
        });
    }
    
    startGame() {
        if (!this.gameLoop) {
            this.reset();
            this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
    
    restartGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.reset();
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.draw();
    }
    
    generateCoin() {
        const coin = {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize)),
            type: Math.random() < 0.2 ? 'special' : 'normal'
        };
        this.coins.push(coin);
    }
    
    update() {
        if (this.isPaused || this.isGameOver) return;
        
        // Update direction
        this.direction = this.nextDirection;
        
        // Move snake
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };
        
        // Check collision with walls
        if (this.checkWallCollision(head) || this.checkSelfCollision(head)) {
            this.endGame();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check coin collection
        let coinCollected = false;
        this.coins = this.coins.filter(coin => {
            if (coin.x === head.x && coin.y === head.y) {
                this.score += coin.type === 'special' ? 20 : 10;
                this.updateScore();
                if (coin.type === 'special') this.showRandomTip();
                coinCollected = true;
                return false;
            }
            return true;
        });
        
        // If no coin was collected, remove tail
        if (!coinCollected) {
            this.snake.pop();
        }
        
        // Generate new coin if needed
        if (this.coins.length === 0) {
            this.generateCoin();
        }
        
        this.draw();
    }
    
    checkWallCollision(head) {
        return (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= this.canvas.width / this.gridSize ||
            head.y >= this.canvas.height / this.gridSize
        );
    }
    
    checkSelfCollision(head) {
        return this.snake.some(segment =>
            segment !== this.snake[0] &&
            segment.x === head.x &&
            segment.y === head.y
        );
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#8b5cf6' : '#6366f1';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });
        
        // Draw coins
        this.coins.forEach(coin => {
            this.ctx.fillStyle = coin.type === 'special' ? '#f59e0b' : '#ec4899';
            this.ctx.beginPath();
            this.ctx.arc(
                (coin.x * this.gridSize) + this.gridSize/2,
                (coin.y * this.gridSize) + this.gridSize/2,
                this.gridSize/2 - 1,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    showRandomTip() {
        const tip = this.tips[Math.floor(Math.random() * this.tips.length)];
        this.tipElement.textContent = tip;
    }
    
    endGame() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        
        // Save high score
        const currentHighScore = localStorage.getItem('snakeHighScore') || 0;
        if (this.score > currentHighScore) {
            localStorage.setItem('snakeHighScore', this.score);
        }
        
        // Show game over message
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Game Over!',
            this.canvas.width/2,
            this.canvas.height/2 - 30
        );
        this.ctx.fillText(
            `Score: ${this.score}`,
            this.canvas.width/2,
            this.canvas.height/2 + 20
        );
        this.ctx.fillText(
            `High Score: ${Math.max(this.score, currentHighScore)}`,
            this.canvas.width/2,
            this.canvas.height/2 + 70
        );
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    game.draw();
}); 