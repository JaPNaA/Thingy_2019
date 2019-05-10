import VariableSymbolLine from "./variable.js";
export default class SymbolB extends VariableSymbolLine {
    constructor(name, comment) {
        super(name);
        this.order = 1;
        this.comment = comment;
    }
    setPtr(ptr) {
        this._setValue("b" + ptr);
        return ptr + 1;
    }
}
