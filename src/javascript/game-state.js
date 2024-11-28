export class GameState {
    constructor() {
        this.reset();
    }

    reset(wordObject = { word: '', hint: '' }) {
        this.currentWord = wordObject.word;
        this.currentHint = wordObject.hint;
        this.guessedLetters = new Set();
        this.remainingGuesses = 6;
        this.status = 'playing';
        this.lastStatus = 'playing';
    }

    addGuessedLetter(letter) {
        this.guessedLetters.add(letter.toUpperCase());
    }

    hasGuessedLetter(letter) {
        return this.guessedLetters.has(letter.toUpperCase());
    }

    decrementGuesses() {
        this.remainingGuesses--;
    }

    isOutOfGuesses() {
        return this.remainingGuesses === 0;
    }

    isWordGuessed() {
        return this.currentWord.split('').every(letter => this.guessedLetters.has(letter));
    }

    setGameWon() {
        this.status = 'won';
    }

    setGameLost() {
        this.status = 'lost';
    }

    isGameOver() {
        return this.status === 'won' || this.status === 'lost';
    }

    isGameWon() {
        return this.status === 'won';
    }

    isGameLost() {
        return this.status === 'lost';
    }

    getDisplayWord() {
        return this.currentWord.split('').map(letter => {
            const span = document.createElement('span');
            span.textContent = this.guessedLetters.has(letter) ? letter : '_';
            span.className = this.guessedLetters.has(letter) ? 'guessed' : 'unguessed';
            return span;
        });
    }
}