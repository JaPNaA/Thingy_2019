import Cell from "./cell.js";
import Matrix from "../matrix/matrix.js";
import TetrominoColorMap from "../tetromino/tetrominoColorMap.js";
var PlayField = /** @class */ (function () {
    function PlayField(game) {
        this.scale = 24;
        this.game = game;
        this.field = new Matrix(PlayField.width, PlayField.height + PlayField.vanishHeight, function () { return new Cell(); });
    }
    PlayField.prototype.renderTo = function (startX, startY, canvas) {
        var _this = this;
        var X = canvas.getX();
        var fallingTetromino = this.game.getTetromino();
        var ghostTetrominoDist = this.getGhostTetrominoDist(fallingTetromino);
        X.fillStyle = "#000000";
        X.fillRect(startX, startY, PlayField.width * this.scale, PlayField.height * this.scale);
        X.strokeStyle = "#888888";
        this.field.forEach(function (cell, x, y) {
            if (y >= PlayField.height) {
                return;
            }
            if (cell.isOccupied()) {
                X.fillStyle = TetrominoColorMap[cell.block];
            }
            else if (fallingTetromino) {
                if (fallingTetromino.isIn(x, y)) {
                    X.fillStyle = TetrominoColorMap[fallingTetromino.type];
                }
                else if (fallingTetromino.isIn(x, y + ghostTetrominoDist)) {
                    X.fillStyle = "#888888";
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
            X.beginPath();
            X.rect(x * _this.scale + startX, (PlayField.height - y - 1) * _this.scale + startY, _this.scale, _this.scale);
            X.fill();
            X.stroke();
        });
    };
    PlayField.prototype.update = function () {
        var linesCleared = 0;
        rowsLoop: for (var i = this.field.height - 1; i >= 0; i--) {
            var row = this.field.matrix[i];
            for (var j = 0; j < this.field.width; j++) {
                if (!row[j].isOccupied()) {
                    continue rowsLoop;
                }
            }
            this.clearLine(i);
            linesCleared++;
        }
        if (linesCleared) {
            this.game.getScoring().clearLines(linesCleared);
        }
    };
    PlayField.prototype.clearLine = function (index) {
        this.field.matrix.splice(index, 1);
        this.field.matrix.push(this.field.createRow(this.field.height - 1));
    };
    PlayField.prototype.getGhostTetrominoDist = function (fallingTetromino) {
        if (!fallingTetromino) {
            return 0;
        }
        return fallingTetromino.getY() - fallingTetromino.getHardDropY(this.field);
    };
    PlayField.width = 10;
    PlayField.height = 20;
    PlayField.vanishHeight = 2;
    return PlayField;
}());
export default PlayField;
