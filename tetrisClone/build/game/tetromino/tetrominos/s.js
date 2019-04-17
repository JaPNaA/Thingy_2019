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
import Matrix33 from "../../matrix/matrix33.js";
import TetrominoType from "../tetrominoType.js";
var TetrominoS = /** @class */ (function (_super) {
    __extends(TetrominoS, _super);
    function TetrominoS(game) {
        var _this = _super.call(this, game) || this;
        _this.type = TetrominoType.s;
        _this.matrix = new Matrix33(function (x, y) { return Cell.copy(TetrominoS.layout[y][x]); });
        _this.setup();
        return _this;
    }
    TetrominoS.layout = strArrToLayout([
        " ##",
        "## ",
        "   "
    ], TetrominoType.s);
    return TetrominoS;
}(Tetromino));
export default TetrominoS;
