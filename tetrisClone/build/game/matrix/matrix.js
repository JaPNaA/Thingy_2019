var Matrix = /** @class */ (function () {
    function Matrix(width, height, filler) {
        this.matrix = [];
        this.width = width;
        this.height = height;
        this.filler = filler;
        this.fillMatrix();
    }
    Matrix.fromArray = function (arr) {
        var mat = new Matrix(arr[0].length, arr.length);
        mat.matrix = arr;
        return mat;
    };
    Matrix.prototype.forEach = function (cb) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                cb(this.matrix[i][j], j, i);
            }
        }
    };
    Matrix.prototype.createRow = function (i) {
        if (!this.filler) {
            throw new Error("No filler specified");
        }
        var arr = [];
        for (var j = 0; j < this.width; j++) {
            arr[j] = this.filler(j, i);
        }
        return arr;
    };
    Matrix.prototype.fillMatrix = function () {
        if (!this.filler) {
            return;
        }
        for (var i = 0; i < this.height; i++) {
            this.matrix[i] = this.createRow(i);
        }
    };
    return Matrix;
}());
export default Matrix;
