export class UIManager {
    constructor() {
        this.wordDisplay = document.getElementById('word-display');
        this.hangmanDrawing = document.getElementById('hangman-drawing');
        this.guessedLettersElement = document.getElementById('guessed-letters');
        this.keyboard = document.getElementById('keyboard');
        this.gameImage = document.querySelector('#game-pic img');
        this.message = document.getElementById('message');
        this.hangmanImage = document.querySelector('#hangman-pic img');
        this.newGameBtn = document.getElementById('new-game-btn');
    }

    setupEventListeners(handleGuess, startNewGame) {
        this.keyboard.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') handleGuess(e.target.textContent);
        });
        this.newGameBtn.addEventListener('click', startNewGame);
    }

    updateDisplay(gameState) {
        this.updateWordDisplay(gameState);
        this.updateHangmanDrawing(gameState);
        this.updateGuessedLetters(gameState);
        this.updateMessage(gameState);
        this.updateHint(gameState);
        this.updateGameImage(gameState);
        this.updateKeyboard(gameState);
    }

    updateHint(gameState) {
        const hintElement = document.getElementById('word-hint');
        if (hintElement) {
            hintElement.innerHTML = `<p>Hint: <span class="txt-blue">${gameState.currentHint}</span></p>`;
        }
    }

    updateWordDisplay(gameState) {
        this.wordDisplay.innerHTML = '';
        gameState.getDisplayWord().forEach(letterSpan => {
            this.wordDisplay.appendChild(letterSpan);
        });
    }

    updateHangmanDrawing(gameState) {
        const incorrectGuesses = 6 - gameState.remainingGuesses;
        const imageSrc = `./src/assets/images/hangman-pic-${incorrectGuesses}.jpg`;
        this.hangmanImage.src = imageSrc;

        this.hangmanDrawing.innerHTML = `<p>Remaining guesses: <span class="txt-blue">${gameState.remainingGuesses}</span></p>`;
    }

    updateGuessedLetters(gameState) {
        this.guessedLettersElement.innerHTML = `<p>Guessed: <span class="txt-blue">${Array.from(gameState.guessedLetters).join(', ')}</span></p>`;
    }

    updateMessage(gameState) {
        this.message.innerHTML = '';
        if (gameState.isGameWon()) {
            this.message.innerHTML = `<p><span class="txt-blue">Congratulations!</span> You guessed the word, <span class="txt-blue">${gameState.currentWord}</span>, correctly!</p>`;
            this.newGameBtn.textContent = 'Play Again';
        } else if (gameState.isGameLost()) {
            this.message.innerHTML = `<p><span class="txt-red">Game over</span>. The word was: <span class="txt-blue">${gameState.currentWord}</span></p>`;
            this.newGameBtn.textContent = 'Play Again';
        } else {
            this.newGameBtn.textContent = 'New Game';
        }
    }

    updateGameImage(gameState, forceUpdate = false) {
        let imageSrc = './src/assets/images/hangman-banner-pic.jpg';
        if (gameState.isGameWon()) {
            imageSrc = './src/assets/images/hangman-win-pic.jpg';
        } else if (gameState.isGameLost()) {
            imageSrc = './src/assets/images/hangman-lost-pic.jpg';
        }

        if (gameState.status !== gameState.lastStatus || forceUpdate) {
            this.gameImage.src = imageSrc;
            this.gameImage.classList.remove('fade-in');
            void this.gameImage.offsetWidth;
            this.gameImage.classList.add('fade-in');
            gameState.lastStatus = gameState.status;
        }
    }

    updateKeyboard(gameState) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.keyboard.innerHTML = '';
        for (const letter of alphabet) {
            const button = document.createElement('button');
            button.textContent = letter;
            button.disabled = gameState.hasGuessedLetter(letter) || gameState.isGameOver();
            if (gameState.isGameOver()) {
                button.classList.add('game-over');
            }
            this.keyboard.appendChild(button);
        }
    }
}