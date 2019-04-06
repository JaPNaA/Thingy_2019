import Handler from "./eventHandler.js";

class EventHandlers<T = void> {
    private handlers: Handler<T>[];

    public constructor() {
        this.handlers = [];
    }

    public add(handler: Handler<T>) {
        this.handlers.push(handler);
    }

    public remove(handler: Handler<T>) {
        const ix = this.handlers.indexOf(handler);
        if (ix < 0) { throw new Error("Removing handler that doesn't exist"); }
        this.handlers.splice(ix, 0);
    }

    public dispatch(data: T) {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}

export default EventHandlers;