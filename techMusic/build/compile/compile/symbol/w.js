import VariableSymbolLine from "./variable.js";
export default class SymbolW extends VariableSymbolLine {
    constructor(name, comment) {
        super(name);
        this.order = 2;
        this.comment = comment;
    }
    setPtr(ptr) {
        this._setValue("w" + Math.floor(ptr / 2));
        return ptr + 2;
    }
}
