var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix44 from "../../matrix/matrix44.js";
import TetrominoType from "../tetrominoType.js";
import copy2dArr from "../../../utils/copy2dArr.js";
import RotationState from "../tetrominoRotationState.js";
var TetrominoI = /** @class */ (function (_super) {
    __extends(TetrominoI, _super);
    function TetrominoI(game) {
        var _this = _super.call(this, game) || this;
        _this.type = TetrominoType.i;
        _this.y = 20;
        _this.matrix = new Matrix44(function (x, y) { return Cell.copy(TetrominoI.layout[y][x]); });
        _this.setup();
        return _this;
    }
    TetrominoI.prototype.ifCanRotateCW = function (mat) {
        var thisMat = Matrix44.fromArray(copy2dArr(this.matrix.matrix, this.matrix.width, this.matrix.height));
        thisMat.rotate();
        // using SRS
        var tests = TetrominoI.iwallKickDataCW[this.rotationState];
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
    TetrominoI.layout = strArrToLayout([
        "    ",
        "####",
        "    ",
        "    "
    ], TetrominoType.i);
    TetrominoI.iwallKickDataCW = (_a = {},
        _a[RotationState.up] = [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        _a[RotationState.right] = [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        _a[RotationState.down] = [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        _a[RotationState.left] = [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
        _a);
    return TetrominoI;
}(Tetromino));
export default TetrominoI;
