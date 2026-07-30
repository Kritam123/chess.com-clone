import { GlobalEvents } from "../Events/globalEvents.js";
import { createInitialBoard } from "../Helper/boardFactory.js";
import { initGame } from "./main.js";

let keySquareMapper = createInitialBoard();
let globalState = Object.values(keySquareMapper);

function setBoard(board) {
    keySquareMapper = board;
    globalState = Object.values(board);
}

initGame(keySquareMapper);
GlobalEvents();

export { globalState, keySquareMapper, setBoard };
