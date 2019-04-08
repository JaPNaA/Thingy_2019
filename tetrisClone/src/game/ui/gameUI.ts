import AutoKeyTimer from "./autoKeyTimer.js";
import KeyboardUI from "./keyboardUI.js";
import IGameHooks from "../iGameHooks.js";
import { Action } from "./action.js";

class GameUI {
    private keyboardUI: KeyboardUI;
    private game: IGameHooks;

    private downTimer: AutoKeyTimer;
    private leftTimer: AutoKeyTimer;
    private rightTimer: AutoKeyTimer;

    private timers: AutoKeyTimer[];

    public autoDelay: number = 150;
    public autoInterval: number = 25;

    public constructor(game: IGameHooks) {
        this.keyboardUI = new KeyboardUI();
        this.game = game;

        this.downTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);
        this.leftTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);
        this.rightTimer = new AutoKeyTimer(this.autoDelay, this.autoInterval);

        this.timers = [
            this.downTimer, this.leftTimer, this.rightTimer
        ];
    }

    public update(deltaTime: number) {
        this.updateTimers(deltaTime);
        this.updateTetromino();
    }

    private updateTimers(deltaTime: number) {
        for (const timer of this.timers) {
            timer.update(deltaTime);
        }

        if (this.keyboardUI.getAction(Action.down)) {
            this.downTimer.startHoldIfNotAlready();
        } else {
            this.downTimer.stopHold();
        }

        if (this.keyboardUI.getAction(Action.left)) {
            this.leftTimer.startHoldIfNotAlready();
        } else {
            this.leftTimer.stopHold();
        }

        if (this.keyboardUI.getAction(Action.right)) {
            this.rightTimer.startHoldIfNotAlready();
        } else {
            this.rightTimer.stopHold();
        }
    }

    private updateTetromino() {
        const tetromino = this.game.getTetromino();
        const playfield = this.game.getPlayField();

        if (!tetromino) { return; }

        if (this.keyboardUI.getOnceAction(Action.rotateCW)) {
            tetromino.ifCanRotateCW(playfield.field);
        }

        for (; this.leftTimer.times > 0; this.leftTimer.times--) {
            if (!tetromino.canGoLeft(playfield.field)) break;
            tetromino.left();
        }
        this.leftTimer.times = 0;

        for (; this.rightTimer.times > 0; this.rightTimer.times--) {
            if (!tetromino.canGoRight(playfield.field)) break;
            tetromino.right();
        }
        this.rightTimer.times = 0;

        for (; this.downTimer.times > 0; this.downTimer.times--) {
            if (!tetromino.canFall(playfield.field)) break;
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
            this.game.getLogic().hold();
        }
    }
}

export default GameUI;