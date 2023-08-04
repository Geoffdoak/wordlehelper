import { Word } from "./Word";

type LetterState = "BLANK" | "UNUSED" | "USED" | "CORRECT";

// This is the individual letter component. It renders itself on screen.
// It has four states (blank, unused, used, correct). It handles its
// own click events and handles its own visual updates
export class Letter {
    private character: string;
    private state: LetterState;
    private isActive: boolean;
    private element: HTMLElement;
    private word: Word;

    constructor(word: Word) {
        this.character = "";
        this.state = "BLANK";
        this.isActive = false;
        this.element = document.createElement('div');
        this.element.classList.add('letter');
        this.element.innerText = this.character;
        this.element.classList.add(this.state.toLowerCase());
        this.word = word;
    }

    get() {
        return {
            character: this.character,
            state: this.state,
            isActive: this.isActive
        }
    }

    // Returns the letter's parent word
    getWord() {
        return this.word;
    }

    getCharacter() {
        return this.character;
    }

    // Sets the character and changes state to 'UNUSED'
    setCharacter(character: string) {
        this.character = character.toLowerCase();
        this.element.innerText = this.character;
        
        if(character !== "") this.setState('UNUSED')
    }

    getState() {
        return this.state;
    }

    // Sets the state of the element and also updates its DOM
    // element
    setState(state: LetterState) {
        this.state = state;
        ['blank', 'unused', 'used', 'correct'].forEach(className => {
            this.element.classList.remove(className);
        });
        this.element.classList.add(state.toLowerCase());

        if (state === 'BLANK') this.setCharacter("");
    }

    getIsActive() {
        return this.isActive;
    }

    // Changes the active state of the letter and its DOM element.
    // This method should be run by the gameboard which manages this
    // state
    setActive() {
        this.isActive = true;
        this.element.classList.add('active');
    }

    // See setActive
    setInactive() {
        this.isActive = false;
        this.element.classList.remove('active');
    }

    // Requests the gameboard to set it as active so the
    // gameboard can manage the active state of all of the 
    // letters
    requestSetActive() {
        this.getWord().getGameBoard().setActiveLetter(this);
    }


    setClickEvents() {
        this.element.onclick = () => this.toggle();
    }

    // Renders the letter in the DOM and attaches the click events
    render(target: HTMLElement) {
        target.insertAdjacentElement('beforeend',this.element);
        this.setClickEvents();
    }

    toggle() {
        if (this.getState() === 'UNUSED') {
            this.setState('USED');
            return;
        }

        if (this.getState() === 'USED') {
            this.setState('CORRECT');
            return;
        }

        if (this.getState() === 'CORRECT') {
            this.setState('UNUSED');
            return;
        }

        return;
    }
}