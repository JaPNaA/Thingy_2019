var EventHandlers = /** @class */ (function () {
    function EventHandlers() {
        this.handlers = [];
    }
    EventHandlers.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    EventHandlers.prototype.remove = function (handler) {
        var ix = this.handlers.indexOf(handler);
        if (ix < 0) {
            throw new Error("Removing handler that doesn't exist");
        }
        this.handlers.splice(ix, 0);
    };
    EventHandlers.prototype.dispatch = function (data) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler(data);
        }
    };
    return EventHandlers;
}());
export default EventHandlers;
