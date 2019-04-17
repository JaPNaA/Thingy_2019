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
import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix22 from "../../matrix/matrix22.js";
import TetrominoType from "../tetrominoType.js";
var TetrominoO = /** @class */ (function (_super) {
    __extends(TetrominoO, _super);
    function TetrominoO(game) {
        var _this = _super.call(this, game) || this;
        _this.type = TetrominoType.o;
        _this.matrix = new Matrix22(function (x, y) { return Cell.copy(TetrominoO.layout[y][x]); });
        _this.setup();
        return _this;
    }
    // o doesn't need to be tested
    TetrominoO.prototype.ifCanRotateCW = function () {
        this.rotateCW();
        return true;
    };
    TetrominoO.layout = strArrToLayout([
        "##",
        "##"
    ], TetrominoType.o);
    return TetrominoO;
}(Tetromino));
export default TetrominoO;
