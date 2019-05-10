import DynamicSymbolLine from "./dynamic.js";

export default abstract class VariableSymbolLine extends DynamicSymbolLine {
    constructor(name: string) {
        super(name);
    }

    abstract setPtr(ptr: number): number;
}