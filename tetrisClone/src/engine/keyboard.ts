import Handler from "./eventHandler.js";
import EventHandlers from "./eventHandlers.js";

class Keyboard {
    private static keydownHandlers: EventHandlers<KeyboardEvent>;
    private static keyupHandlers: EventHandlers<KeyboardEvent>;

    public static _setup() {
        this.keydownHandlers = new EventHandlers<KeyboardEvent>();
        this.keyupHandlers = new EventHandlers<KeyboardEvent>();

        addEventListener("keydown", this.dispatchKeydown.bind(this));
        addEventListener("keyup", this.dispatchKeyup.bind(this));
    }

    public static onKeydown(handler: Handler<KeyboardEvent>): void {
        this.keydownHandlers.add(handler);
    }

    public static offKeydown(handler: Handler<KeyboardEvent>): void {
        this.keydownHandlers.remove(handler);
    }

    public static onKeyup(handler: Handler<KeyboardEvent>): void {
        this.keyupHandlers.add(handler);
    }

    public static offKeyup(handler: Handler<KeyboardEvent>): void {
        this.keyupHandlers.remove(handler);
    }

    private static dispatchKeydown(data: KeyboardEvent): void {
        this.keydownHandlers.dispatch(data);
    }

    private static dispatchKeyup(data: KeyboardEvent): void {
        this.keyupHandlers.dispatch(data);
    }
}

Keyboard._setup();

export default Keyboard;