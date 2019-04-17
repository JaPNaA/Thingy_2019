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
import Matrix from "./matrix.js";
import copy2dArr from "../../utils/copy2dArr.js";
var Matrix22 = /** @class */ (function (_super) {
    __extends(Matrix22, _super);
    function Matrix22(filler) {
        var _this = _super.call(this, 2, 2, filler) || this;
        _this.width = 2;
        _this.height = 2;
        return _this;
    }
    Matrix22.fromArray = function (arr) {
        var mat = new Matrix22();
        mat.matrix = arr;
        return mat;
    };
    Matrix22.prototype.rotate = function () {
        var copy = copy2dArr(this.matrix, this.width, this.height);
        this.matrix[0][0] = copy[1][0];
        this.matrix[0][1] = copy[0][0];
        this.matrix[1][0] = copy[1][1];
        this.matrix[1][1] = copy[0][1];
    };
    return Matrix22;
}(Matrix));
export default Matrix22;
