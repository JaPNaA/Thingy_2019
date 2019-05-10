import ProgramLine from "./programLine.js";
import isDeffer from "./utils/isDeffer.js";
export default class ForLoop extends ProgramLine {
    constructor(times, iterator, instruction, stack) {
        super();
        this.times = times;
        this.iterator = iterator;
        this.instruction = instruction;
        this.stack = stack;
    }
    toMainString() {
        const name = isDeffer(this.iterator) ? this.iterator.name : this.iterator;
        const arr = [
            "for " + name + " = 1 to " + this.times,
            ...(this.instruction.toString(1) || "").split("\n"),
            "next " + name
        ];
        if (this.stack) {
            arr.unshift("let temp" + this.stack.num + " = " + name, "gosub pushStack" + this.stack.num);
            arr.push("gosub popStack" + this.stack.num, "let " + name + " = " + "temp" + this.stack.num);
        }
        return arr;
    }
}
