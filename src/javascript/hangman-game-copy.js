class HangmanGame {
    constructor() {
        this.words = [];
        this.currentWord = '';
        this.guessedLetters = new Set();
        this.remainingGuesses = 6;
        this.gameStatus = 'playing'; // 'playing', 'won', or 'lost'

        this.wordDisplay = document.getElementById('word-display');
        this.hangmanDrawing = document.getElementById('hangman-drawing');
        this.guessedLettersElement = document.getElementById('guessed-letters');
        this.keyboard = document.getElementById('keyboard');
        this.gameImage = document.querySelector('#game-pic img');
        this.lastGameStatus = 'playing';
        this.message = document.getElementById('message');
        this.newGameBtn = document.getElementById('new-game-btn');

        this.loadWords().then(() => {
            this.setupEventListeners(); 
        });
    }

    async loadWords() {
        try {
            const response = await fetch('./src/data/hangman-words.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.words = data.words.map(word => word.toUpperCase());
            console.log('Words loaded successfully:', this.words);
            this.startNewGame();
        } catch (error) {
            console.error('Error loading words:', error);
            this.words = ['FALLBACK', 'WORDS', 'IN', 'CASE', 'OF', 'ERROR'];
            this.startNewGame();
        }
    }

    setupEventListeners() {
        this.keyboard.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.handleGuess(e.target.textContent);
            }
        });

        this.newGameBtn.addEventListener('click', () => this.startNewGame());
    }

    startNewGame() {
        this.currentWord = this.getRandomWord();
        this.guessedLetters.clear();
        this.remainingGuesses = 6;
        this.gameStatus = 'playing';
        this.newGameBtn.textContent = 'New Game'; // Reset button text here
        this.updateDisplay();
        this.updateGameImage(true);
        console.log('New game started with word:', this.currentWord); // For debugging
    }

    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    handleGuess(letter) {
        letter = letter.toUpperCase();
        if (this.gameStatus !== 'playing' || this.guessedLetters.has(letter)) return;

        this.guessedLetters.add(letter);

        if (!this.currentWord.includes(letter)) {
            this.remainingGuesses--;
        }

        this.checkGameStatus();
        this.updateDisplay();
    }

    checkGameStatus() {
        if (this.getDisplayWord().every(span => span.textContent !== '_')) {
            this.gameStatus = 'won';
            this.updateKeyboard(); 
        } else if (this.remainingGuesses === 0) {
            this.gameStatus = 'lost';
            this.updateKeyboard();
        }
    }

    getDisplayWord() {
        return this.currentWord.split('').map(letter => {
            const span = document.createElement('span');
            span.textContent = this.guessedLetters.has(letter) ? letter : '_';
            span.className = this.guessedLetters.has(letter) ? 'guessed' : 'unguessed';
            return span;
        });
    }

    updateDisplay() {
        // Update word display (assuming you've implemented the previous suggestion)
        this.wordDisplay.innerHTML = '';
        this.getDisplayWord().forEach(letterSpan => {
            this.wordDisplay.appendChild(letterSpan);
        });
    
        // Update hangman drawing
        this.hangmanDrawing.innerHTML = '';
        const drawingP = document.createElement('p');
        drawingP.innerHTML = `Remaining guesses: <span class="txt-blue">${this.remainingGuesses}</span>`;
        this.hangmanDrawing.appendChild(drawingP);
    
        // Update guessed letters
        this.guessedLettersElement.innerHTML = '';
        const guessedP = document.createElement('p');
        guessedP.innerHTML = `Guessed: <span class="txt-blue">${Array.from(this.guessedLetters).join(', ')}</span>`;
        this.guessedLettersElement.appendChild(guessedP);
    
        // Update game status message
        if (this.gameStatus === 'won') {
            this.message.innerHTML = '';
            const winMessage = document.createElement('p');
            winMessage.innerHTML = `Congratulations! You guessed the word, <span class="txt-blue">${this.currentWord}</span>, correctly!`;
            this.message.appendChild(winMessage);
            this.newGameBtn.textContent = 'Play Again';
        } else if (this.gameStatus === 'lost') {
            this.message.innerHTML = '';
            const lostMessage = document.createElement('p');
            lostMessage.innerHTML = `Game over. The word was: <span class="txt-blue">${this.currentWord}</span>`;
            this.message.appendChild(lostMessage);
            this.newGameBtn.textContent = 'Play Again';
        } else {
            this.message.textContent = '';
            this.newGameBtn.textContent = 'New Game';
        }
        this.updateGameImage();
        this.updateKeyboard();
    }

    updateKeyboard() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.keyboard.innerHTML = '';
        for (const letter of alphabet) {
            const button = document.createElement('button');
            button.textContent = letter;
            button.disabled = this.guessedLetters.has(letter) || this.gameStatus !== 'playing';
            if (this.gameStatus !== 'playing') {
                button.classList.add('game-over');
            }
            this.keyboard.appendChild(button);
        }
    }

    updateGameImage(forceUpdate = false) {
        let imageSrc;
        if (this.gameStatus === 'won') {
            imageSrc = './src/assets/images/hangman-win-pic.jpg';
        } else if (this.gameStatus === 'lost') {
            imageSrc = './src/assets/images/hangman-lost-pic.jpg';
        } else {
            imageSrc = './src/assets/images/hangman-banner-pic.jpg';
        }

        // Only update and animate if the status has changed or forceUpdate is true
        if (this.gameStatus !== this.lastGameStatus || forceUpdate) {
            this.gameImage.src = imageSrc;
            this.gameImage.classList.remove('fade-in');
            void this.gameImage.offsetWidth; // Trigger reflow
            this.gameImage.classList.add('fade-in');
            this.lastGameStatus = this.gameStatus;
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});