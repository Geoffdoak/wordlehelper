import "./style.scss";
import { GameBoard } from "./components/GameBoard";

export const wordLength = 5;
export const totalGuesses = 6;

const gameBoard = new GameBoard();
const target = document.getElementById('content');
gameBoard.render(target);

// Keyboard key listener
document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if(e.key.length ===1 && "abcdefghijklmnopqrstuvwxyz".indexOf(e.key.toLowerCase()) >= 0) {
        console.log('keypress', e.key);
        gameBoard.setActiveLetterChar(e.key);
    }

    if (e.key === 'Backspace') {
        gameBoard.deleteActiveCharacter();
    }
})

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});