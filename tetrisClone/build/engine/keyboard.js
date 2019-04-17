import EventHandlers from "./eventHandlers.js";
var Keyboard = /** @class */ (function () {
    function Keyboard() {
    }
    Keyboard._setup = function () {
        this.keydownHandlers = new EventHandlers();
        this.keyupHandlers = new EventHandlers();
        addEventListener("keydown", this.dispatchKeydown.bind(this));
        addEventListener("keyup", this.dispatchKeyup.bind(this));
    };
    Keyboard.onKeydown = function (handler) {
        this.keydownHandlers.add(handler);
    };
    Keyboard.offKeydown = function (handler) {
        this.keydownHandlers.remove(handler);
    };
    Keyboard.onKeyup = function (handler) {
        this.keyupHandlers.add(handler);
    };
    Keyboard.offKeyup = function (handler) {
        this.keyupHandlers.remove(handler);
    };
    Keyboard.dispatchKeydown = function (data) {
        this.keydownHandlers.dispatch(data);
    };
    Keyboard.dispatchKeyup = function (data) {
        this.keyupHandlers.dispatch(data);
    };
    return Keyboard;
}());
Keyboard._setup();
export default Keyboard;
