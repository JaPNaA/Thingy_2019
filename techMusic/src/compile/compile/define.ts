import ProgramLine from "./programLine.js";

export default class Define extends ProgramLine {
    constructor(public label: string, public value: string) {
        super();
    }

    protected toMainString(): (string | ProgramLine)[] {
        return ["#define " + this.label + " " + this.value];
    }
}