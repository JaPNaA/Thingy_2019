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
var Matrix44 = /** @class */ (function (_super) {
    __extends(Matrix44, _super);
    function Matrix44(filler) {
        var _this = _super.call(this, 4, 4, filler) || this;
        _this.width = 4;
        _this.height = 4;
        return _this;
    }
    Matrix44.fromArray = function (arr) {
        var mat = new Matrix44();
        mat.matrix = arr;
        return mat;
    };
    Matrix44.prototype.rotate = function () {
        var copy = copy2dArr(this.matrix, this.width, this.height);
        this.matrix[0][0] = copy[3][0];
        this.matrix[0][1] = copy[2][0];
        this.matrix[0][2] = copy[1][0];
        this.matrix[0][3] = copy[0][0];
        this.matrix[1][0] = copy[3][1];
        this.matrix[1][1] = copy[2][1];
        this.matrix[1][2] = copy[1][1];
        this.matrix[1][3] = copy[0][1];
        this.matrix[2][0] = copy[3][2];
        this.matrix[2][1] = copy[2][2];
        this.matrix[2][2] = copy[1][2];
        this.matrix[2][3] = copy[0][2];
        this.matrix[3][0] = copy[3][3];
        this.matrix[3][1] = copy[2][3];
        this.matrix[3][2] = copy[1][3];
        this.matrix[3][3] = copy[0][3];
    };
    return Matrix44;
}(Matrix));
export default Matrix44;
