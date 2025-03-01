import { financialTerms, financialTips, achievements } from './financial-data.js';

class WordScrambleGame {
    constructor() {
        this.currentTerm = null;
        this.difficulty = 'basic';
        this.score = 0;
        this.termsLearned = new Set();
        this.streak = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.isGameActive = false;

        // DOM Elements
        this.wordDisplay = document.getElementById('scrambled-word');
        this.inputField = document.getElementById('word-input');
        this.hintButton = document.getElementById('hint-button');
        this.submitButton = document.getElementById('submit-button');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.definitionDisplay = document.getElementById('definition');
        this.streakDisplay = document.getElementById('streak');
        this.tipDisplay = document.getElementById('financial-tip');

        // Event Listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
    }

    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.streak = 0;
        this.termsLearned.clear();
        this.timeLeft = 60;
        this.updateDisplays();
        this.startTimer();
        this.nextWord();
        this.showRandomTip();
    }

    resetGame() {
        if (this.timer) clearInterval(this.timer);
        this.startGame();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplays();
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }

    scrambleWord(word) {
        const arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    nextWord() {
        const terms = financialTerms[this.difficulty];
        const unusedTerms = terms.filter(term => !this.termsLearned.has(term.term));
        
        if (unusedTerms.length === 0) {
            this.termsLearned.clear(); // Reset if all terms are used
            this.currentTerm = terms[Math.floor(Math.random() * terms.length)];
        } else {
            this.currentTerm = unusedTerms[Math.floor(Math.random() * unusedTerms.length)];
        }

        const scrambled = this.scrambleWord(this.currentTerm.term);
        this.wordDisplay.textContent = scrambled;
        this.definitionDisplay.textContent = '';
        this.inputField.value = '';
        this.inputField.focus();
    }

    showHint() {
        if (!this.currentTerm) return;
        this.definitionDisplay.textContent = `Hint: ${this.currentTerm.hint}`;
        this.score = Math.max(0, this.score - 1); // Penalty for using hint
        this.updateDisplays();
    }

    checkAnswer() {
        const userAnswer = this.inputField.value.trim().toUpperCase();
        if (userAnswer === this.currentTerm.term) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.streak++;
        this.score += this.calculatePoints();
        this.termsLearned.add(this.currentTerm.term);
        this.definitionDisplay.textContent = `Correct! Definition: ${this.currentTerm.definition}`;
        this.checkAchievements();
        this.updateDisplays();
        setTimeout(() => this.nextWord(), 2000);
    }

    handleIncorrectAnswer() {
        this.streak = 0;
        this.definitionDisplay.textContent = 'Try again!';
        this.updateDisplays();
    }

    calculatePoints() {
        const difficultyMultiplier = {
            'basic': 1,
            'intermediate': 2,
            'advanced': 3
        };
        return (10 + this.streak) * difficultyMultiplier[this.difficulty];
    }

    showRandomTip() {
        const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
        this.tipDisplay.textContent = `💡 ${randomTip}`;
    }

    checkAchievements() {
        const wordScrambleAchievements = achievements.wordScramble;
        for (const achievement of wordScrambleAchievements) {
            if (achievement.requirement === this.termsLearned.size) {
                this.showAchievement(achievement);
            }
        }
    }

    showAchievement(achievement) {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement-popup';
        achievementDiv.innerHTML = `
            <h3>🏆 Achievement Unlocked!</h3>
            <p>${achievement.name}</p>
            <p>${achievement.description}</p>
        `;
        document.body.appendChild(achievementDiv);
        setTimeout(() => achievementDiv.remove(), 3000);
    }

    updateDisplays() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        this.timerDisplay.textContent = `Time: ${this.timeLeft}s`;
        this.streakDisplay.textContent = `Streak: ${this.streak}`;
    }

    endGame() {
        this.isGameActive = false;
        clearInterval(this.timer);
        const finalScore = this.score;
        const termsLearned = this.termsLearned.size;
        
        // Show game over screen
        this.wordDisplay.textContent = 'Game Over!';
        this.definitionDisplay.innerHTML = `
            Final Score: ${finalScore}<br>
            Terms Learned: ${termsLearned}<br>
            <button onclick="window.wordScrambleGame.resetGame()">Play Again</button>
        `;
        
        // Save high score
        const highScore = localStorage.getItem('wordScrambleHighScore') || 0;
        if (finalScore > highScore) {
            localStorage.setItem('wordScrambleHighScore', finalScore);
        }
    }
}

// Initialize game
window.wordScrambleGame = new WordScrambleGame(); 