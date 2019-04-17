var Timer = /** @class */ (function () {
    function Timer(delay) {
        this.delay = delay || 0;
        this.time = 0;
        this.count = 0;
        this.paused = true;
    }
    Timer.prototype.start = function () {
        this.paused = false;
    };
    Timer.prototype.update = function (deltaTime) {
        if (this.paused) {
            return;
        }
        this.time += deltaTime;
        this.count += Math.floor(this.time / this.delay);
        this.time %= this.delay;
    };
    Timer.prototype.stop = function () {
        this.pause();
        this.time = 0;
    };
    Timer.prototype.restart = function () {
        this.time = 0;
    };
    Timer.prototype.pause = function () {
        this.paused = false;
    };
    return Timer;
}());
export default Timer;
