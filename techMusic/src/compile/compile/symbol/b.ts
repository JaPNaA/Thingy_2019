import VariableSymbolLine from "./variable.js";

export default class SymbolB extends VariableSymbolLine {
    public order = 1;
    constructor(name: string, comment?: string) {
        super(name);
        this.comment = comment;
    }

    public setPtr(ptr: number): number {
        this._setValue("b" + ptr);
        return ptr + 1;
    }
}