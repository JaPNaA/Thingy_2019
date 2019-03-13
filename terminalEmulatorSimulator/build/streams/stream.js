class Stream {
    constructor() {
        this._buffer = [];
        this.dataHandlers = [];
        this.outs = [];
    }
    onData(handler) {
        this.dataHandlers.push(handler);
    }
    pipe(to) {
        this.outs.push(to);
    }
    cutOff() {
        this.outs.length = 0;
        this.dataHandlers.length = 0;
    }
    _onDataHandler() {
        for (const data of this._buffer) {
            for (const handler of this.dataHandlers) {
                handler(data);
            }
        }
        this._buffer.length = 0;
    }
}
export default Stream;
