export class WordManager {
    constructor() {
        this.words = [];
    }

    async loadWords() {
        try {
            const response = await fetch('./src/data/hangman-words.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.words = data.words.map(item => ({
                word: item.word.toUpperCase(),
                hint: item.hint
            }));
        } catch (error) {
            console.error('Error loading words:', error);
            this.words = [{ word: 'FALLBACK', hint: 'Default word in case of error' }];
        }
    }

    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }
}