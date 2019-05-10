import ProgramLine from "./programLine.js";
import Deffer from "./deffer.js";

export default class FnDef extends ProgramLine implements Deffer {
    public inline: boolean;
    constructor(public name: string, public instructions: (ProgramLine | string)[], public ending?: string, public boundTrack?: number) {
        super();
        this.inline = false;
    }

    protected toMainString(): (string | ProgramLine)[] | null {
        if (this.inline) { return null; }
        let str: string[] = [];
        for (const instruction of this.instructions) {
            if (typeof instruction === 'string') {
                str.push("\t" + instruction);
            } else {
                const instructionStr = instruction.toString(1);
                if (instructionStr) { str.push(instructionStr); }
            }
        }
        str = [this.name + ":"].concat(str);
        str.push("\t" + (this.ending || "return"));
        str.push("");
        return str;
    }
}