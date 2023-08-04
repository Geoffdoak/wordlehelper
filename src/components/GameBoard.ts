import { wordLength } from "..";
import { totalGuesses } from "..";
import { Letter } from "./Letter";
import { Word } from "./Word";
import { PossibleWords } from "./PossibleWords";
import { VirtualKeyboard } from "./VirtualKeyboard";

// Coordinates all of the letters and their state, the virtual keyboard and
// the filtering of possible words
export class GameBoard {
    private words: Array<Word>;
    private element: HTMLElement;
    private possibleWords: PossibleWords;
    private virtualKeyBoard: VirtualKeyboard;

    constructor() {
        // Creation of the gameboard
        this.words = [];

        // Each word creates its own set of letters
        for (let index = 0; index < totalGuesses; index++) {
            this.words.push(new Word(this));
        }

        this.words[0].getLetters()[0].setActive();
        
        // Creation of own HTML element
        this.element = document.createElement('div');
        this.element.classList.add('gamespace');

        // Creating a filter for possible words
        this.possibleWords = new PossibleWords(this);

        // Creating a new virtual keyboard
        this.virtualKeyBoard = new VirtualKeyboard(this);
    }

    getWords() {
        return this.words;
    }

    getKeyboard() {
        return this.virtualKeyBoard;
    }

    // Renders the gameboard, possible words and virtual keyboard
    render(target: HTMLElement) {
        target.insertAdjacentElement('beforeend', this.element);

        const gameElement = document.createElement('div');
        gameElement.classList.add('game');
        this.element.insertAdjacentElement('beforeend', gameElement);
        
        this.words.forEach(word => word.render(gameElement));
        this.possibleWords.render(target);
        this.virtualKeyBoard.render(target);
    }

    // Takes request from a letter to set itself as active, sets that letter
    // active and sets all other letters inactive
    setActiveLetter(letterRequest: Letter) {
        this.getWords().forEach(word => {
            word.getLetters().forEach(letter => {
                if (letter === letterRequest) {
                    letter.setActive();
                } else {
                    letter.setInactive();
                }
            })
        })
    }

    // Iterates all words and their letters to get the index of the active
    // letter
    getActiveLetterIndex() {
        let foundActive = false;
        let foundWordIndex = 0;
        let foundLetterIndex = 0;

        this.words.forEach((word, wordIndex) => {
            word.getLetters().forEach((letter, letterIndex) => {
                if (letter.getIsActive()) {
                    foundActive = true;
                    foundWordIndex = wordIndex;
                    foundLetterIndex = letterIndex;
                }
            })
        });

        return {
            wordIndex: foundWordIndex,
            letterIndex: foundLetterIndex,
            foundActive: foundActive
        }
    }

    // Returns the active letter
    getActiveLetter() {
        const activeLetterIndex = this.getActiveLetterIndex();
        return this.words[activeLetterIndex.wordIndex].getLetters()[activeLetterIndex.letterIndex];
    }

    setActiveLetterChar(character: string) {
        const letter = this.getActiveLetter();
        letter.setCharacter(character);
        this.setNextLetterActive();
    }

    // Sets the next letter to the right in a word as active. If the
    // letter is the last letter in the word, the first letter of the
    // next word is set as active. If that is the last word, the first
    // letter of the first word is set active
    setNextLetterActive() {
        const activeLetter = this.getActiveLetterIndex();
        let nextWordIndex = 0;
        let nextLetterIndex = 0;

        if (!activeLetter.foundActive) return;

        if (activeLetter.letterIndex < wordLength - 1) {
            nextLetterIndex = activeLetter.letterIndex + 1;
            nextWordIndex = activeLetter.wordIndex
        } else if (activeLetter.wordIndex < totalGuesses - 1) {
            nextLetterIndex = 0;
            nextWordIndex = activeLetter.wordIndex + 1;
        }

        this.words[nextWordIndex].getLetters()[nextLetterIndex].requestSetActive();
    }

    // Works in the opposite direction as setNextLetterActive()
    setPreviousLetterActive() {
        const activeLetter = this.getActiveLetterIndex();
        let nextWordIndex = 0;
        let nextLetterIndex = 0;

        if (!activeLetter.foundActive) return;

        if (activeLetter.letterIndex > 0) {
            nextLetterIndex = activeLetter.letterIndex - 1;
            nextWordIndex = activeLetter.wordIndex
        } else if (activeLetter.wordIndex > 0) {
            nextLetterIndex = wordLength - 1;
            nextWordIndex = activeLetter.wordIndex - 1;
        }

        this.words[nextWordIndex].getLetters()[nextLetterIndex].requestSetActive();
    }

    // Sets the active character blank, sets the previous letter active and sets it blank
    deleteActiveCharacter() {
        let letter = this.getActiveLetter();  
        letter.setState('BLANK');
        this.setPreviousLetterActive();
        letter = this.getActiveLetter();
        letter.setState('BLANK');
    }

    // Triggers the possble remaining word list to update
    update() {
        this.possibleWords.renderList();
    }
}