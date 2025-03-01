import { financialMathProblems, financialTips, achievements } from './financial-data.js';

class MathQuizGame {
    constructor() {
        this.currentProblem = null;
        this.difficulty = 'basic';
        this.score = 0;
        this.problemsSolved = 0;
        this.streak = 0;
        this.timeLeft = 120;
        this.timer = null;
        this.isGameActive = false;

        // DOM Elements
        this.questionDisplay = document.getElementById('question');
        this.optionsContainer = document.getElementById('options-container');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.difficultySelect = document.getElementById('difficulty-select');
        this.explanationDisplay = document.getElementById('explanation');
        this.streakDisplay = document.getElementById('streak');
        this.tipDisplay = document.getElementById('financial-tip');

        // Event Listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetGame();
        });
    }

    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.streak = 0;
        this.problemsSolved = 0;
        this.timeLeft = 120;
        this.updateDisplays();
        this.startTimer();
        this.nextProblem();
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

    nextProblem() {
        const problems = financialMathProblems[this.difficulty];
        this.currentProblem = problems[Math.floor(Math.random() * problems.length)];
        
        this.questionDisplay.textContent = this.currentProblem.question;
        this.optionsContainer.innerHTML = '';
        
        this.currentProblem.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(index));
            this.optionsContainer.appendChild(button);
        });

        this.explanationDisplay.textContent = '';
    }

    checkAnswer(selectedIndex) {
        if (!this.isGameActive) return;

        const buttons = this.optionsContainer.querySelectorAll('.option-button');
        buttons.forEach(button => button.disabled = true);

        if (selectedIndex === this.currentProblem.correct) {
            this.handleCorrectAnswer(buttons[selectedIndex]);
        } else {
            this.handleIncorrectAnswer(buttons[selectedIndex], buttons[this.currentProblem.correct]);
        }
    }

    handleCorrectAnswer(selectedButton) {
        selectedButton.classList.add('correct');
        this.streak++;
        this.score += this.calculatePoints();
        this.problemsSolved++;
        this.explanationDisplay.textContent = `Correct! ${this.currentProblem.explanation}`;
        this.checkAchievements();
        this.updateDisplays();
        setTimeout(() => this.nextProblem(), 2000);
    }

    handleIncorrectAnswer(selectedButton, correctButton) {
        selectedButton.classList.add('incorrect');
        correctButton.classList.add('correct');
        this.streak = 0;
        this.explanationDisplay.textContent = `Incorrect. ${this.currentProblem.explanation}`;
        this.updateDisplays();
        setTimeout(() => this.nextProblem(), 2000);
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
        const mathQuizAchievements = achievements.mathQuiz;
        for (const achievement of mathQuizAchievements) {
            if (achievement.requirement === this.problemsSolved || 
                (achievement.requirement === 'perfectScore' && this.score >= 100)) {
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
        const problemsSolved = this.problemsSolved;
        
        // Show game over screen
        this.questionDisplay.textContent = 'Game Over!';
        this.optionsContainer.innerHTML = '';
        this.explanationDisplay.innerHTML = `
            Final Score: ${finalScore}<br>
            Problems Solved: ${problemsSolved}<br>
            <button onclick="window.mathQuizGame.resetGame()">Play Again</button>
        `;
        
        // Save high score
        const highScore = localStorage.getItem('mathQuizHighScore') || 0;
        if (finalScore > highScore) {
            localStorage.setItem('mathQuizHighScore', finalScore);
        }
    }
}

// Initialize game
window.mathQuizGame = new MathQuizGame(); 