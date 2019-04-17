import { Action } from "./action.js";
import Keyboard from "../../engine/keyboard.js";
var KeyboardUI = /** @class */ (function () {
    function KeyboardUI() {
        var _a, _b;
        this.mappings = {
            38: Action.rotateCW,
            88: Action.rotateCW,
            97: Action.rotateCW,
            101: Action.rotateCW,
            105: Action.rotateCW,
            17: Action.rotateCCW,
            90: Action.rotateCCW,
            99: Action.rotateCW,
            103: Action.rotateCW,
            32: Action.hardDrop,
            104: Action.hardDrop,
            37: Action.left,
            100: Action.left,
            39: Action.right,
            102: Action.right,
            40: Action.down,
            98: Action.down,
            16: Action.hold,
            67: Action.hold,
            96: Action.hold,
            27: Action.pause,
            112: Action.pause,
        };
        this.actionState = (_a = {},
            _a[Action.rotateCW] = false,
            _a[Action.rotateCCW] = false,
            _a[Action.hardDrop] = false,
            _a[Action.hold] = false,
            _a[Action.pause] = false,
            _a[Action.left] = false,
            _a[Action.right] = false,
            _a[Action.down] = false,
            _a);
        this.onceActionState = (_b = {},
            _b[Action.rotateCW] = false,
            _b[Action.rotateCCW] = false,
            _b[Action.hardDrop] = false,
            _b[Action.hold] = false,
            _b[Action.pause] = false,
            _b[Action.left] = false,
            _b[Action.right] = false,
            _b[Action.down] = false,
            _b);
        this.keyState = this.createKeyState();
        this.reverseMappings = this.generateReverseMappings();
        this.addEventListeners();
    }
    KeyboardUI.prototype.getAction = function (action) {
        return this.actionState[action];
    };
    KeyboardUI.prototype.getOnceAction = function (action) {
        var state = this.onceActionState[action];
        this.onceActionState[action] = false;
        return state;
    };
    KeyboardUI.prototype.addEventListeners = function () {
        this.keydownHandler = this.keydownHandler.bind(this);
        Keyboard.onKeydown(this.keydownHandler);
        this.keyupHandler = this.keyupHandler.bind(this);
        Keyboard.onKeyup(this.keyupHandler);
    };
    KeyboardUI.prototype.createKeyState = function () {
        var arr = [];
        for (var i = 0; i < 255; i++) {
            arr[i] = false;
        }
        return arr;
    };
    KeyboardUI.prototype.generateReverseMappings = function () {
        var keys = Object.keys(this.mappings);
        var reverseMap = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var value = this.mappings[key];
            if (reverseMap.hasOwnProperty(value)) {
                reverseMap[value].push(key);
            }
            else {
                reverseMap[value] = [key];
            }
        }
        return reverseMap;
    };
    // private updateAllActionStates(): void {
    //     for (const actionState of actionsList) {
    //         this.updateActionState(actionState);
    //     }
    // }
    KeyboardUI.prototype.updateActionState = function (action) {
        var prevState = this.actionState[action];
        this.actionState[action] = false;
        for (var _i = 0, _a = this.reverseMappings[action]; _i < _a.length; _i++) {
            var key = _a[_i];
            if (this.keyState[parseInt(key)]) {
                this.actionState[action] = true;
                if (!prevState) {
                    this.onceActionState[action] = true;
                }
                return;
            }
        }
    };
    KeyboardUI.prototype.keydownHandler = function (e) {
        this.keyState[e.keyCode] = true;
        this.keyChangeHandler(e);
    };
    KeyboardUI.prototype.keyupHandler = function (e) {
        this.keyState[e.keyCode] = false;
        this.keyChangeHandler(e);
    };
    KeyboardUI.prototype.keyChangeHandler = function (e) {
        var action = this.mappings[e.keyCode];
        if (action === undefined) {
            return;
        }
        e.preventDefault();
        this.updateActionState(action);
    };
    return KeyboardUI;
}());
export default KeyboardUI;
