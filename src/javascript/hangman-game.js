import { WordManager } from './word-manager.js';
import { UIManager } from './ui-manager.js';
import { GameState } from './game-state.js';

class HangmanGame {
    constructor() {
        this.wordManager = new WordManager();
        this.uiManager = new UIManager();
        this.gameState = new GameState();

        this.init();
    }

    async init() {
        await this.wordManager.loadWords();
        this.uiManager.setupEventListeners(this.handleGuess.bind(this), this.startNewGame.bind(this));
        this.startNewGame();
    }

    startNewGame() {
        const wordObject = this.wordManager.getRandomWord();
        this.gameState.reset(wordObject);
        this.uiManager.updateDisplay(this.gameState);
        this.uiManager.updateGameImage(this.gameState, true);
    }

    handleGuess(letter) {
        if (this.gameState.isGameOver() || this.gameState.hasGuessedLetter(letter)) return;
    
        this.gameState.addGuessedLetter(letter);
    
        if (!this.gameState.currentWord.includes(letter)) {
            this.gameState.decrementGuesses();
            this.uiManager.updateHangmanDrawing(this.gameState);
        }
    
        this.checkGameStatus();
        this.uiManager.updateDisplay(this.gameState);
    }

    checkGameStatus() {
        if (this.gameState.isWordGuessed()) {
            this.gameState.setGameWon();
        } else if (this.gameState.isOutOfGuesses()) {
            this.gameState.setGameLost();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new HangmanGame());