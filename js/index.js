import { GlobalEvents } from "../Events/globalEvents.js";
import { initData } from "./data.js";
import { initGame } from "./main.js";


const globalState = initData();
let keySquareMapper = {};

globalState.flat().forEach((square) => {
  keySquareMapper[square.id] = square;
});
initGame(globalState);
GlobalEvents();

export {globalState,keySquareMapper};