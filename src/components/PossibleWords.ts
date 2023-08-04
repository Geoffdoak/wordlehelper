import { wordList } from "../wordlist";
import { GameBoard } from "./GameBoard";

// This components shows all of the possible remaining words.
// It handles it's own rendering updates. It gets the state
// of the letters from the gameboard and applies a series of
// filters matching the rules of Wordle
export class PossibleWords {
    private element: HTMLElement;
    private wordListElement: HTMLElement;
    private filteredList: Array<string>;
    private gameBoard: GameBoard;
    private unusedLetters: Array<[string, number]>;
    private usedLetters: Array<[string, number]>;
    private correctLetters: Array<[string,number]>;

    constructor(gameBoard: GameBoard) {
        this.element = document.createElement('div');
        this.element.classList.add("possible-words");
        this.wordListElement = document.createElement('div');
        this.wordListElement.classList.add('possible-words__list');
        this.gameBoard = gameBoard;
        this.usedLetters = [];
        this.unusedLetters = [];
        this.correctLetters = [];
        this.filteredList = [];
    }

    // Gets the state of all the letters and updates a list of letters
    // that are correct. Items in the list include the character and its
    // position in the word. Unique letter/positions only
    updateCorrectLetters() {
        this.correctLetters = [];
        this.gameBoard.getWords().forEach(word => {
            word.getLetters().forEach((letter, index) => {
                if (letter.getState() === 'CORRECT') {
                    const correctLetter: [string,number] = [letter.getCharacter(),index];
                    if(!this.correctLetters.includes(correctLetter)) {
                        this.correctLetters.push(correctLetter);
                    }
                }
            });
        });
    }

    // Similar to updateCorrectLetters but for used letters
    updateUsedLetters() {
        this.usedLetters = [];
        this.gameBoard.getWords().forEach(word => {
            word.getLetters().forEach((letter, index) => {
                if (letter.getState() === 'USED') {
                    const usedLetter: [string,number] = [letter.getCharacter(),index];
                    if(!this.usedLetters.includes(usedLetter)) {
                        this.usedLetters.push(usedLetter);
                    }
                }
            });
        });
    }

    // Similar to updateCorrectLetters but for unused letters
    updateUnusedLetters() {
        this.unusedLetters = [];
        this.gameBoard.getWords().forEach(word => {
            word.getLetters().forEach((letter, index) => {
                if (letter.getState() === 'UNUSED') {
                    const character: [string, number] = [letter.getCharacter(),index];
                    if(!this.unusedLetters.includes(character)) {
                        this.unusedLetters.push(character);
                    }
                }
            });
        });
    }



    // Filters out words from a list of all possible words that do not
    // fit in with the rules of Wordle
    filterList() {
        // Update the lists of letters with various states
        this.updateCorrectLetters();
        this.updateUsedLetters();
        this.updateUnusedLetters();

        // Creates a new list of unused letters that removes the unused
        // letters that have been otherwise used or correct
        const unsedLettersRemovingUsedandCorrect = this.unusedLetters.filter((letter) => {
            let keepLetter = true;

            this.correctLetters.forEach((correctLetter) => {
                if (letter[0] === correctLetter[0]) keepLetter = false;
            });

            this.usedLetters.forEach((usedLetter) => {
                if (letter[0] === usedLetter[0]) keepLetter = false;
            });

            return keepLetter;
        });

        // Filtering of the possible words
        this.filteredList = wordList.filter((word) => {
            let keepWord = true;
            const characterArray = word.split('');

            // Removes word if it does not contain the correct letters in their
            // correct position
            this.correctLetters.forEach((correctLetter) => {
                if (characterArray[correctLetter[1]] !== correctLetter[0]) keepWord = false;
            });

            // Removes words that do not contain all of the used letters
            this.usedLetters.forEach((usedLetter) => {
                if (!characterArray.includes(usedLetter[0])) keepWord = false;
                
                characterArray.forEach((character, index) => {
                    if (character === usedLetter[0] && index === usedLetter[1]) keepWord = false;
                })
            });

            // Removes words that use unused letters
            characterArray.forEach((character) => {
                if (unsedLettersRemovingUsedandCorrect.map(l=>l[0]).includes(character)) {
                    keepWord = false
                };
            });

            this.unusedLetters.forEach((unusedLetter) => {
                if(characterArray[unusedLetter[1]] === unusedLetter[0]) keepWord = false;
            })

            return keepWord;
        });
    }

    // Makes the possible words appear on screen. Triggers virtual
    // keyboard to hide itself
    show() {
        this.element.classList.add('possible-words--show');
        this.gameBoard.getKeyboard().hide();
        
        const offset = this.element.offsetTop;
        
        this.element.style.transform = `translateY(-${offset}px)`;
        this.renderList();
    }

    // Hides the possible words on screen. Triggers virtual
    // keyboard to reappear
    hide() {
        this.element.classList.remove('possible-words--show');
        this.gameBoard.getKeyboard().show();

        this.element.style.transform = `translateY(0px)`;
    }
    
    // Renders the possible words container on the screen and
    // attaches the click events
    render(target:HTMLElement) {
        target.insertAdjacentElement('beforeend', this.element);

        const clickElement = document.createElement('div');
        clickElement.classList.add('possible-words__click-wrapper');
        this.element.insertAdjacentElement('beforeend', clickElement);

        const clickButton = document.createElement('div');
        clickButton.classList.add('possible-words__check-button');
        clickButton.innerText = "Check possible words";
        clickElement.insertAdjacentElement('beforeend', clickButton);

        clickButton.onclick = () => this.show();

        const closeButton = document.createElement('div');
        closeButton.classList.add('possible-words__close');
        closeButton.innerText = "Close";
        clickElement.insertAdjacentElement('beforeend', closeButton);

        closeButton.onclick = () => this.hide();

        this.element.insertAdjacentElement('beforeend', this.wordListElement);
        
        this.renderList();
    }

    // Renders the list of possible remaining word. Triggers the remaining
    // word list to update first
    renderList() {
        this.filterList();
        this.wordListElement.innerHTML = '';
        this.filteredList.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('possible-words__word');
            word.split('').forEach((character) => {
                const characterElement = document.createElement('span');
                characterElement.innerText = character;
                wordElement.insertAdjacentElement('beforeend', characterElement);
            })
            this.wordListElement.insertAdjacentElement('beforeend', wordElement);
        })
    }
}