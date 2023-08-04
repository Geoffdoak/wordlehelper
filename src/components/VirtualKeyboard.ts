import { GameBoard } from "./GameBoard";

// Onscreen keyboard. Component renders itself on screen and can be
// shown or hidden. Sends key events to the gameboard
export class VirtualKey {
    private character: string;
    private keyboard: VirtualKeyboard;
    private element: HTMLElement;

    constructor(character: string, keyboard: VirtualKeyboard) {
        this.character = character;
        this.keyboard = keyboard;
        this.element = document.createElement('div');
        this.element.classList.add("virtual-keyboard__key");
        this.element.innerText = this.character;
    }

    getElement() {
        return this.element;
    }

    sendKeyInput() {
        this.keyboard.pressKey(this.character);
    }

    setClickEvents() {
        this.element.onclick = () => this.sendKeyInput();
    }

    render(target: HTMLElement) {
        target.insertAdjacentElement('beforeend', this.element);
        this.setClickEvents();
    }
}

export class Backspace extends VirtualKey {
    render(target: HTMLElement) {
        const element = this.getElement();
        element.classList.add('virtual-keyboard__key--backspace');
        element.innerText = '←';
        target.insertAdjacentElement('beforeend', element);
        this.setClickEvents();
    }
}

export class VirtualKeyboard {
    private gameBoard: GameBoard;
    private firstRow: Array<VirtualKey>;
    private secondRow: Array<VirtualKey>;
    private thirdRow: Array<VirtualKey>;
    private element: HTMLElement;

    constructor(gameBoard: GameBoard) {
        this.gameBoard = gameBoard;
        this.element = document.createElement('div')
        this.element.classList.add("virtual-keyboard");

        this.firstRow = ["q","w","e","r","t","y","u","i","o","p"].map((character) => {
            return new VirtualKey(character, this)
        });
        this.secondRow = ["a","s","d","f","g","h","j","k","l"].map((character) => {
            return new VirtualKey(character, this)
        });
        this.thirdRow = ["z","x","c","v","b","n","m"].map((character) => {
            return new VirtualKey(character, this)
        });

        this.thirdRow.push(new Backspace("Backspace", this));
    }
    
    pressKey(character: string) {
        if(character.length ===1 && "abcdefghijklmnopqrstuvwxyz".indexOf(character.toLowerCase()) >= 0) {
            console.log('keypress', character);
            this.gameBoard.setActiveLetterChar(character);
        }
    
        if (character === 'Backspace') {
            this.gameBoard.deleteActiveCharacter();
        }
    }

    render(target: HTMLElement) {
        const firstRowElement = document.createElement('div');
        firstRowElement.classList.add("virtual-keyboard__row","virtual-keyboard__row--first");
        this.firstRow.forEach((key) => {
            key.render(firstRowElement);
        });

        const secondRowElement = document.createElement('div');
        secondRowElement.classList.add("virtual-keyboard__row","virtual-keyboard__row--second");
        this.secondRow.forEach((key) => {
            key.render(secondRowElement);
        });

        const thirdRowElement = document.createElement('div');
        thirdRowElement.classList.add("virtual-keyboard__row","virtual-keyboard__row--third");
        this.thirdRow.forEach((key) => {
            key.render(thirdRowElement);
        });

        this.element.insertAdjacentElement('beforeend',firstRowElement);
        this.element.insertAdjacentElement('beforeend',secondRowElement);
        this.element.insertAdjacentElement('beforeend',thirdRowElement);

        target.insertAdjacentElement('beforeend',this.element);
    }

    hide() {
        this.element.classList.add('virtual-keyboard--hidden');
    }

    show() {
        this.element.classList.remove('virtual-keyboard--hidden');
    }
}