import ProgramLine from "./programLine.js";
export default class CommentLine extends ProgramLine {
    constructor(comment) {
        super();
        this.comment = comment;
    }
    toMainString() {
        const lines = this.comment.trim().split("\n");
        const out = [];
        for (const line of lines) {
            if (line.trim().length === 0) {
                out.push("");
            }
            out.push("; " + line);
        }
        return out;
    }
}
