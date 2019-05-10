import ProgramLine from "./programLine.js";
export default class FnDef extends ProgramLine {
    constructor(name, instructions, ending, boundTrack) {
        super();
        this.name = name;
        this.instructions = instructions;
        this.ending = ending;
        this.boundTrack = boundTrack;
        this.inline = false;
    }
    toMainString() {
        if (this.inline) {
            return null;
        }
        let str = [];
        for (const instruction of this.instructions) {
            if (typeof instruction === 'string') {
                str.push("\t" + instruction);
            }
            else {
                const instructionStr = instruction.toString(1);
                if (instructionStr) {
                    str.push(instructionStr);
                }
            }
        }
        str = [this.name + ":"].concat(str);
        str.push("\t" + (this.ending || "return"));
        str.push("");
        return str;
    }
}
