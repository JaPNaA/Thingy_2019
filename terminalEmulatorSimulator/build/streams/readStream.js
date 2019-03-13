import Stream from "./stream.js";
class ReadStream extends Stream {
    constructor() {
        super();
    }
    hasNext() {
        return this._buffer.length !== 0;
    }
    next() {
        return this._buffer.shift();
    }
}
export default ReadStream;
