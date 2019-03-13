import Stream from "./stream.js";
class WriteStream extends Stream {
    constructor() {
        super();
    }
    write(obj) {
        if (this.outs.length === 0) {
            this._buffer.push(obj);
            return;
        }
        for (const out of this.outs) {
            out._buffer.push(obj);
            out._onDataHandler();
        }
        this._onDataHandler();
    }
}
export default WriteStream;
