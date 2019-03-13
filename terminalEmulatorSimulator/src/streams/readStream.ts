import Stream from "./stream.js";

class ReadStream<T> extends Stream<any, T> {
    constructor() {
        super();
    }

    public hasNext(): boolean {
        return this._buffer.length !== 0;
    }

    public next(): T | undefined {
        return this._buffer.shift();
    }
}

export default ReadStream;