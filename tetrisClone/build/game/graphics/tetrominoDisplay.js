import tetrominoClassMap from "../tetromino/tetrominoClassMap.js";
import renderTetromino from "../../utils/renderTetromino.js";
var TetrominoDisplay = /** @class */ (function () {
    function TetrominoDisplay(game, options) {
        if (options === void 0) { options = {}; }
        this.game = game;
        this.x = options.x || TetrominoDisplay.defaultX;
        this.y = options.y || TetrominoDisplay.defaultY;
        this.scale = options.scale || TetrominoDisplay.defaultScale;
        this.width = options.width || TetrominoDisplay.defaultWidth;
        this.height = options.height || TetrominoDisplay.defaultHeight;
    }
    TetrominoDisplay.prototype.render = function (canvas) {
        if (this.tetromino === undefined) {
            return;
        }
        renderTetromino(this.tetromino, canvas, this.scale, this.x, this.y, this.width, this.height);
    };
    TetrominoDisplay.prototype.setTetromino = function (tetromino) {
        if (tetromino === undefined) {
            this.tetromino = undefined;
        }
        else if (this.isDifferentFrom(tetromino)) {
            this.tetromino = new tetrominoClassMap[tetromino](this.game);
        }
    };
    TetrominoDisplay.prototype.isDifferentFrom = function (tetromino) {
        return this.tetromino === undefined || tetromino !== this.tetromino.type;
    };
    TetrominoDisplay.defaultX = 8;
    TetrominoDisplay.defaultY = 8;
    TetrominoDisplay.defaultScale = 24;
    TetrominoDisplay.defaultWidth = 4;
    TetrominoDisplay.defaultHeight = 4;
    return TetrominoDisplay;
}());
export default TetrominoDisplay;
