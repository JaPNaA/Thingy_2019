import ProgramLine from "./programLine.js";
export default class Define extends ProgramLine {
    constructor(label, value) {
        super();
        this.label = label;
        this.value = value;
    }
    toMainString() {
        return ["#define " + this.label + " " + this.value];
    }
}
