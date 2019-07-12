import Game from "./game/Game";

const game = new Game();
game.appendTo(document.body);

console.log(game);

// @ts-ignore
window.game = game;