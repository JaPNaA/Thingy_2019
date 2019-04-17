var _a;
import PlayField from "../playField/playfield.js";
import RotationState from "./tetrominoRotationState.js";
import Matrix33 from "../matrix/matrix33.js";
import copy2dArr from "../../utils/copy2dArr.js";
var Tetromino = /** @class */ (function () {
    function Tetromino(game) {
        this.startX = this.x = 0;
        this.startY = this.y = 20;
        this.game = game;
        this.rotationState = RotationState.up;
    }
    Tetromino.prototype.setup = function () {
        this.x = Math.floor((PlayField.width - this.matrix.width) / 2);
        this.startX = this.x;
        this.startY = this.y;
    };
    Tetromino.prototype.resetPos = function () {
        this.x = this.startX;
        this.y = this.startY;
    };
    Tetromino.prototype.fall = function () {
        this.y--;
        this.onMove();
    };
    Tetromino.prototype.left = function () {
        this.x--;
        this.onMove();
    };
    Tetromino.prototype.right = function () {
        this.x++;
        this.onMove();
    };
    Tetromino.prototype.rotateCW = function () {
        this.matrix.rotate();
        this.rotationState = (this.rotationState + 1) % 4;
        this.onMove();
    };
    Tetromino.prototype.isIn = function (x, y) {
        var row = this.matrix.matrix[this.y - y];
        if (!row) {
            return false;
        }
        var cell = row[x - this.x];
        if (!cell) {
            return false;
        }
        return cell.isOccupied();
    };
    Tetromino.prototype.placeOn = function (mat) {
        var _this = this;
        this.matrix.forEach(function (elm, x_, y_) {
            var y = _this.y - y_;
            var x = x_ + _this.x;
            if (elm.isOccupied() &&
                mat.matrix[y] && mat.matrix[y][x]) {
                mat.matrix[y][x].block = elm.block;
            }
        });
    };
    /** Checks if the tetromino can fall one y down */
    Tetromino.prototype.canFall = function (mat) {
        return this.canBeAt(this.x, this.y - 1, this.matrix, mat);
    };
    Tetromino.prototype.canGoLeft = function (mat) {
        return this.canBeAt(this.x - 1, this.y, this.matrix, mat);
    };
    Tetromino.prototype.canGoRight = function (mat) {
        return this.canBeAt(this.x + 1, this.y, this.matrix, mat);
    };
    Tetromino.prototype.ifCanRotateCW = function (mat) {
        var thisMat = Matrix33.fromArray(copy2dArr(this.matrix.matrix, this.matrix.width, this.matrix.height));
        thisMat.rotate();
        // using SRS
        var tests = Tetromino.wallKickDataCW[this.rotationState];
        for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
            var test = tests_1[_i];
            if (this.canBeAt(this.x + test[0], this.y + test[1], thisMat, mat)) {
                this.rotateCW();
                this.x += test[0];
                this.y += test[1];
                return true;
            }
        }
        return false;
    };
    Tetromino.prototype.canRotateCCW = function () {
        return false;
    };
    Tetromino.prototype.getHardDropY = function (mat) {
        var oldY = this.y;
        while (this.canFall(mat)) {
            this.fall();
        }
        var newY = this.y;
        this.y = oldY;
        return newY;
    };
    Tetromino.prototype.getY = function () {
        return this.y;
    };
    /** Checks if the tetromino can be at the specified position */
    Tetromino.prototype.canBeAt = function (thisX, thisY, thisMat, mat) {
        for (var i = 0; i < thisMat.width; i++) {
            for (var j = 0; j < thisMat.height; j++) {
                var thisCell = thisMat.matrix[i][j];
                var y = thisY - i;
                var x = j + thisX;
                var matCell = mat.matrix[y] && mat.matrix[y][x];
                if (matCell) {
                    if (matCell.isOccupied() && thisCell.isOccupied()) {
                        return false;
                    }
                }
                else {
                    if (thisCell.isOccupied()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Tetromino.prototype.onMove = function () {
        this.game.getPhysics().tetrominoMoved();
    };
    Tetromino.wallKickDataCW = (_a = {},
        _a[RotationState.up] = [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        _a[RotationState.right] = [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        _a[RotationState.down] = [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        _a[RotationState.left] = [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        _a);
    return Tetromino;
}());
export default Tetromino;
