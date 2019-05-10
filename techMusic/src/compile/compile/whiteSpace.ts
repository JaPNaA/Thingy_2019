import ProgramLine from "./programLine.js";

export default class WhiteSpaceLine extends ProgramLine {
    constructor() { super(); }

    protected toMainString(): string[] {
        return [""];
    }
}