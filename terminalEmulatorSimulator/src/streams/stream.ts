import DataHandler from "./dataHandler.js";

class Stream<TIn, TOut> {
    public _buffer: TOut[];
    protected outs: Stream<TOut, any>[];

    private dataHandlers: DataHandler<TOut>[];

    constructor() {
        this._buffer = [];
        this.dataHandlers = [];
        this.outs = [];
    }

    public onData(handler: DataHandler<TOut>) {
        this.dataHandlers.push(handler);
    }

    public pipe(to: Stream<TOut, any>) {
        this.outs.push(to);
    }

    public cutOff() {
        this.outs.length = 0;
        this.dataHandlers.length = 0;
    }

    public _onDataHandler() {
        for (const data of this._buffer) {
            for (const handler of this.dataHandlers) {
                handler(data);
            }
        }

        this._buffer.length = 0;
    }
}

export default Stream;