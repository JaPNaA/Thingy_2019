import ProgramLine from "../programLine.js";
import Deffer from "../deffer.js";

export default abstract class DynamicSymbolLine extends ProgramLine implements Deffer {
    public comment?: string;
    public value?: string;
    public abstract order: number;

    constructor(public name: string) { super(); }

    protected _setValue(value: string) {
        this.value = value;
    }

    protected toMainString(): string[] {
        if (!this.value) { throw new Error("Cannot evaluate symbol with undefined value"); }
        let str = "symbol " + this.name + " = " + this.value;
        if (this.comment) {
            str += " ; " + this.comment;
        }
        return [str];
    }
}