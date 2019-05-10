import ProgramLine from "./programLine.js";
export default class EnableTimeLine extends ProgramLine {
    constructor() { super(); }
    toMainString() {
        return ["enabletime"];
    }
}
