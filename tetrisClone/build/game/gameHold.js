import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
var GameHold = /** @class */ (function () {
    function GameHold(game) {
        this.game = game;
        this.held = false;
    }
    GameHold.prototype.getHold = function () {
        return this.holdingTetromino;
    };
    GameHold.prototype.onNewTetromino = function () {
        this.held = false;
    };
    GameHold.prototype.hold = function () {
        if (this.held) {
            return;
        }
        if (this.holdingTetromino !== undefined) {
            var oldHold = this.holdingTetromino;
            this.setHold(this.game.getTetromino());
            this.game.switchTetromino(new tetrominoClassMap[oldHold](this.game));
        }
        else {
            this.setHold(this.game.getTetromino());
            this.game.newTetromino();
        }
        this.held = true;
    };
    GameHold.prototype.setHold = function (tetromino) {
        this.holdingTetromino = tetromino && tetromino.type;
    };
    return GameHold;
}());
export default GameHold;
