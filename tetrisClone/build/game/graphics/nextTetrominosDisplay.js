import TetrominoDisplay from "./tetrominoDisplay.js";
import TetrominoGenerator from "../tetromino/tetrominoGenerator.js";
var NextTetrominosDisplay = /** @class */ (function () {
    function NextTetrominosDisplay(game) {
        this.game = game;
        this.displays = [];
        this.createDisplays();
    }
    NextTetrominosDisplay.prototype.render = function (canvas) {
        for (var i = 0; i < this.displays.length; i++) {
            this.displays[i].render(canvas);
        }
    };
    NextTetrominosDisplay.prototype.setTetrominos = function (nextTetrominos) {
        for (var i = 0; i < nextTetrominos.length; i++) {
            this.displays[i].setTetromino(nextTetrominos[i]);
        }
    };
    NextTetrominosDisplay.prototype.createDisplays = function () {
        for (var i = 0; i < TetrominoGenerator.queLength; i++) {
            this.displays[i] = new TetrominoDisplay(this.game, {
                x: 480,
                y: 8 + 104 * i,
                scale: 24,
                width: 4,
                height: 4
            });
        }
    };
    return NextTetrominosDisplay;
}());
export default NextTetrominosDisplay;
