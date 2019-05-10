export default class ProgramLine {
    constructor() {
        this.indent = 0;
    }
    toString(additionalIndent) {
        const arr = this.indentMainStringArr(additionalIndent);
        if (!arr) {
            return null;
        }
        return arr.join("\n");
    }
    indentMainStringArr(additionalIndent) {
        const indent = "\t".repeat(this.indent + (additionalIndent || 0));
        const lines = this.toMainString();
        if (!lines) {
            return null;
        }
        let out = [];
        for (const line of lines) {
            if (line instanceof ProgramLine) {
                const arr = line.indentMainStringArr(1);
                if (!arr) {
                    continue;
                }
                out = out.concat(arr);
            }
            else {
                out.push(indent + line);
            }
        }
        return out;
    }
    equals(other) {
        return this.toString() === other.toString();
    }
}
