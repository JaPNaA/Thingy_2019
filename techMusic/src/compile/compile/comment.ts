import ProgramLine from "./programLine.js";

export default class CommentLine extends ProgramLine {
    constructor(public comment: string) { super(); }
    protected toMainString(): string[] {
        const lines = this.comment.trim().split("\n");
        const out = [];

        for (const line of lines) {
            if (line.trim().length === 0) { out.push(""); }
            out.push("; " + line);
        }

        return out;
    }
}