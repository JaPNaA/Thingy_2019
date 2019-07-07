import Game from "./game/Game";
import Evolver from "./evolver/Evolver";

const game = new Game();
const evolver = new Evolver(game);
game.appendTo(document.body);

console.log(game);
console.log(evolver);

// @ts-ignore
window.game = game;