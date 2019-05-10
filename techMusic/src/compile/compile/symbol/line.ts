import DynamicSymbolLine from "./dynamic.js";

export default class SymbolLine extends DynamicSymbolLine {
    public order = 0;

    constructor(name: string, value: string, comment?: string) {
        super(name);
        this._setValue(value);
        this.comment = comment;
    }
}