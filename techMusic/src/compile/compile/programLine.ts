import { Equalable } from "../../equalable.js";

export default abstract class ProgramLine implements Equalable {
    public indent: number;

    constructor() {
        this.indent = 0;
    }

    public toString(additionalIndent?: number): string | null {
        const arr = this.indentMainStringArr(additionalIndent);
        if (!arr) { return null; }
        return arr.join("\n");
    }

    protected indentMainStringArr(additionalIndent?: number): string[] | null {
        const indent = "\t".repeat(this.indent + (additionalIndent || 0));
        const lines = this.toMainString();

        if (!lines) { return null; }

        let out: string[] = [];

        for (const line of lines) {
            if (line instanceof ProgramLine) {
                const arr = line.indentMainStringArr(1);
                if (!arr) { continue; }
                out = out.concat(arr);
            } else {
                out.push(indent + line);
            }
        }

        return out;
    }

    protected abstract toMainString(): (string | ProgramLine)[] | null;

    public equals(other: any): boolean {
        return this.toString() === other.toString();
    }
}