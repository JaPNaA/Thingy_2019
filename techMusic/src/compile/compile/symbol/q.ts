import VariableSymbolLine from "./variable.js";

/**
 * 8 bytes
 */
export default class SymbolQ extends VariableSymbolLine {
    public order = 3;
    constructor() {
        super("");
    }

    public toMainString() {
        return [];
    }

    public setPtr(ptr: number): number {
        this._setValue(ptr.toString());
        return ptr + 8;
    }
}