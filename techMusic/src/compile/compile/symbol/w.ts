import VariableSymbolLine from "./variable.js";

export default class SymbolW extends VariableSymbolLine {
    public order = 2;
    constructor(name: string, comment?: string) {
        super(name);
        this.comment = comment;
    }

    public setPtr(ptr: number): number {
        this._setValue("w" + Math.floor(ptr / 2));
        return ptr + 2;
    }
}