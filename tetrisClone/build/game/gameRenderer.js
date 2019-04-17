import TetrominoDisplay from "./graphics/tetrominoDisplay.js";
import NextTetrominosDisplay from "./graphics/nextTetrominosDisplay.js";
var GameRenderer = /** @class */ (function () {
    function GameRenderer(game) {
        this.game = game;
        this.holdDisplay = new TetrominoDisplay(game);
        this.nextTetrominosDisplay = new NextTetrominosDisplay(this.game);
    }
    GameRenderer.prototype.render = function (canvas) {
        var playfield = this.game.getPlayField();
        playfield.renderTo(128, 8, canvas);
        this.renderHold(canvas);
        this.renderNextTetrominos(canvas);
    };
    GameRenderer.prototype.renderHold = function (canvas) {
        var hold = this.game.getHold().getHold();
        this.holdDisplay.setTetromino(hold);
        this.holdDisplay.render(canvas);
    };
    GameRenderer.prototype.renderNextTetrominos = function (canvas) {
        var next = this.game.getGenerator().que;
        this.nextTetrominosDisplay.setTetrominos(next);
        this.nextTetrominosDisplay.render(canvas);
    };
    return GameRenderer;
}());
export default GameRenderer;
