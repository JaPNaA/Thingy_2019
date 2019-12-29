var BackgroundCanvas = (function () {
    function BackgroundCanvas(canvas) {
        this.canvas = canvas;
        this.width = 0;
        this.height = 0;
        this.unitMaxesMap = [
            ["months", 12],
            ["days", 31],
            ["hours", 24],
            ["minutes", 60],
            ["seconds", 60],
            ["milliseconds", 1000]
        ];
        this.context = this.getContext();
        this.fillStyle = "#000000";
    }
    BackgroundCanvas.prototype.draw = function (dateDiff) {
        this.context.clearRect(0, 0, this.width, this.height);
        var halfWidth = this.width / 2;
        var remaining = 1;
        this.context.fillStyle = this.fillStyle;
        for (var _i = 0, _a = this.unitMaxesMap; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], max = _b[1];
            var value = dateDiff[key];
            if (!value) {
                continue;
            }
            var normalized = value / max;
            var x = remaining * (1 - normalized);
            var width = (remaining - x) / 2 * halfWidth;
            this.context.globalAlpha = 0.075 * (-(Math.pow((x - 1), 10)) + 1);
            this.context.fillRect(x * halfWidth, 0, width, this.height);
            this.context.fillRect(halfWidth * (2 - x) - width, 0, width, this.height);
            remaining -= normalized * remaining;
        }
    };
    BackgroundCanvas.prototype.resizeHandler = function () {
        this.width = innerWidth;
        this.height = innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    };
    BackgroundCanvas.prototype.setColor = function (color) {
        this.fillStyle = color;
    };
    BackgroundCanvas.prototype.getContext = function () {
        var X = this.canvas.getContext("2d");
        if (!X) {
            throw new Error("canvas not suported");
        }
        return X;
    };
    return BackgroundCanvas;
}());
export default BackgroundCanvas;
