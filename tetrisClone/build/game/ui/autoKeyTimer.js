var AutoKeyTimer = /** @class */ (function () {
    function AutoKeyTimer(autoDelay, autoInterval) {
        this.autoDelay = autoDelay;
        this.autoInterval = autoInterval;
        this.autoActive = false;
        this.holding = false;
        this.time = 0;
        this.times = 0;
    }
    AutoKeyTimer.prototype.update = function (deltaTime) {
        if (!this.holding) {
            return;
        }
        this.time += deltaTime;
        if (this.autoActive) {
            this.times += Math.floor(this.time / this.autoInterval);
            this.time %= this.autoInterval;
        }
        else {
            if (this.time > this.autoDelay) {
                this.autoActive = true;
                this.time -= this.autoDelay;
            }
        }
    };
    AutoKeyTimer.prototype.startHoldIfNotAlready = function () {
        if (!this.holding) {
            this.startHold();
        }
    };
    AutoKeyTimer.prototype.startHold = function () {
        this.holding = true;
        this.time = 0;
        this.times = 1;
    };
    AutoKeyTimer.prototype.stopHold = function () {
        this.holding = false;
        this.autoActive = false;
    };
    return AutoKeyTimer;
}());
export default AutoKeyTimer;
