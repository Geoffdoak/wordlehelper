import { wordLength } from "..";
import { Letter } from "./Letter";
import { GameBoard } from "./GameBoard";

// Component contains a grouping of letter components. Acts
// as a middle man between the gameboard and the letters
export class Word {
    private letters: Array<Letter>;
    private element: HTMLElement;
    private wordString: string;
    private gameBoard: GameBoard;

    constructor(gameBoard: GameBoard) {
        this.letters = [];

        for (let index = 0; index < wordLength; index++) {
            this.letters.push(new Letter(this));
        }

        this.element = document.createElement('div');
        this.element.classList.add('word');
        this.wordString = "";
        this.gameBoard = gameBoard;
    }

    get() {
        let letters: any = [];
        this.letters.forEach(letter => letters.push(letter.get()))
        return {
            letters: letters
        }
    }

    getGameBoard() {
        return this.gameBoard;
    }

    getLetters() {
        return this.letters;
    }

    getWordString() {
        this.letters.forEach(letter => {
            this.wordString = this.wordString + letter.getCharacter();
        })
        return this.wordString;
    }

    setWord(word: string) {
        if (word.length != wordLength) return

        for (var i = 0; i < word.length; i++) {
            this.letters[i].setCharacter(word.charAt(i));
        }
    }

    render(target: HTMLElement) {
        target.insertAdjacentElement('beforeend', this.element)
        this.letters.forEach(letter => letter.render(this.element))
    }
}