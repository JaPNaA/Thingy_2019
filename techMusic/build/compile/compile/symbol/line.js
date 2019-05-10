import DynamicSymbolLine from "./dynamic.js";
export default class SymbolLine extends DynamicSymbolLine {
    constructor(name, value, comment) {
        super(name);
        this.order = 0;
        this._setValue(value);
        this.comment = comment;
    }
}
