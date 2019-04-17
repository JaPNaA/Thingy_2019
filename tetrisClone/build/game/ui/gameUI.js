import AutoKeyTimer from "./autoKeyTimer.js";
import KeyboardUI from "./keyboardUI.js";
import { Action } from "./action.js";
var GameUI = /** @class */ (function () {
    function GameUI(game) {
        this.autoDelay = 150;
        this.autoInterval = 25;
        this.keyboardUI = new KeyboardUI();
        this.game = game;
        this.downTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);
        this.leftTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);
        this.rightTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);
        this.timers = [
            this.downTimer, this.leftTimer, this.rightTimer
        ];
    }
    GameUI.prototype.update = function (deltaTime) {
        this.updateTimers(deltaTime);
        this.updateTetromino();
    };
    GameUI.prototype.updateTimers = function (deltaTime) {
        for (var _i = 0, _a = this.timers; _i < _a.length; _i++) {
            var timer = _a[_i];
            timer.update(deltaTime);
        }
        if (this.keyboardUI.getAction(Action.down)) {
            this.downTimer.startHoldIfNotAlready();
        }
        else {
            this.downTimer.stopHold();
        }
        if (this.keyboardUI.getAction(Action.left)) {
            this.leftTimer.startHoldIfNotAlready();
        }
        else {
            this.leftTimer.stopHold();
        }
        if (this.keyboardUI.getAction(Action.right)) {
            this.rightTimer.startHoldIfNotAlready();
        }
        else {
            this.rightTimer.stopHold();
        }
    };
    GameUI.prototype.updateTetromino = function () {
        var tetromino = this.game.getTetromino();
        var playfield = this.game.getPlayField();
        if (!tetromino) {
            return;
        }
        if (this.keyboardUI.getOnceAction(Action.rotateCW)) {
            tetromino.ifCanRotateCW(playfield.field);
        }
        for (; this.leftTimer.times > 0; this.leftTimer.times--) {
            if (!tetromino.canGoLeft(playfield.field))
                break;
            tetromino.left();
        }
        this.leftTimer.times = 0;
        for (; this.rightTimer.times > 0; this.rightTimer.times--) {
            if (!tetromino.canGoRight(playfield.field))
                break;
            tetromino.right();
        }
        this.rightTimer.times = 0;
        for (; this.downTimer.times > 0; this.downTimer.times--) {
            if (!tetromino.canFall(playfield.field))
                break;
            tetromino.fall();
        }
        this.downTimer.times = 0;
        if (this.keyboardUI.getOnceAction(Action.hardDrop)) {
            while (tetromino.canFall(playfield.field)) {
                tetromino.fall();
            }
            tetromino.placeOn(playfield.field);
            this.game.newTetromino();
        }
        if (this.keyboardUI.getOnceAction(Action.hold)) {
            this.game.getHold().hold();
        }
    };
    return GameUI;
}());
export default GameUI;
