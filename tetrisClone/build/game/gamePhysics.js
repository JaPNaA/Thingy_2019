import Timer from "../utils/timer.js";
var GamePhysics = /** @class */ (function () {
    function GamePhysics(game) {
        this.game = game;
        this.tetrominoOnGround = false;
        this.timeNotMoving = 0;
        this.deltaTime = 0;
        this.fallTimer = new Timer(1000);
        this.fallTimer.start();
    }
    GamePhysics.prototype.update = function (deltaTime) {
        this.deltaTime = deltaTime;
        this.fallTetromino();
        this.lockTetromino();
    };
    GamePhysics.prototype.onNewTetromino = function () {
        this.fallTimer.restart();
        this.timeNotMoving = 0;
        this.tetrominoOnGround = false;
    };
    GamePhysics.prototype.tetrominoMoved = function () {
        this.timeNotMoving = 0;
    };
    GamePhysics.prototype.fallTetromino = function () {
        var tetromino = this.game.getTetromino();
        var field = this.game.getPlayField();
        if (!tetromino) {
            return;
        }
        this.fallTimer.update(this.deltaTime);
        for (; this.fallTimer.count > 0; this.fallTimer.count--) {
            if (tetromino.canFall(field.field)) {
                tetromino.fall();
            }
            else {
                break;
            }
        }
        if (tetromino.canFall(field.field)) {
            this.tetrominoOnGround = false;
            this.timeNotMoving = 0;
        }
        else {
            this.tetrominoOnGround = true;
        }
    };
    GamePhysics.prototype.lockTetromino = function () {
        if (this.tetrominoOnGround) {
            this.timeNotMoving += this.deltaTime;
            var tetromino = this.game.getTetromino();
            if (this.timeNotMoving > 500 && tetromino) {
                tetromino.placeOn(this.game.getPlayField().field);
                this.game.newTetromino();
            }
        }
    };
    return GamePhysics;
}());
export default GamePhysics;
