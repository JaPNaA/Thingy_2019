import VariableSymbolLine from "./variable.js";
/**
 * 8 bytes
 */
export default class SymbolQ extends VariableSymbolLine {
    constructor() {
        super("");
        this.order = 3;
    }
    toMainString() {
        return [];
    }
    setPtr(ptr) {
        this._setValue(ptr.toString());
        return ptr + 8;
    }
}
