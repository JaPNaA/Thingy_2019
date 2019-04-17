var Canvas = /** @class */ (function () {
    function Canvas() {
        this.canvas = document.createElement("canvas");
        this.width = 300;
        this.height = 150;
        var X = this.canvas.getContext("2d");
        if (!X) {
            throw new Error("Canvas not supported");
        }
        this.renderingContext = X;
    }
    Canvas.prototype.resize = function (width, height) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
    };
    Canvas.prototype.appendTo = function (parent) {
        parent.appendChild(this.canvas);
    };
    Canvas.prototype.getX = function () {
        return this.renderingContext;
    };
    return Canvas;
}());
export default Canvas;
