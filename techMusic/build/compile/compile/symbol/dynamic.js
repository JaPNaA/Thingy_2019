import ProgramLine from "../programLine.js";
export default class DynamicSymbolLine extends ProgramLine {
    constructor(name) {
        super();
        this.name = name;
    }
    _setValue(value) {
        this.value = value;
    }
    toMainString() {
        if (!this.value) {
            throw new Error("Cannot evaluate symbol with undefined value");
        }
        let str = "symbol " + this.name + " = " + this.value;
        if (this.comment) {
            str += " ; " + this.comment;
        }
        return [str];
    }
}
