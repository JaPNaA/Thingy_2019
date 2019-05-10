import ProgramLine from "./programLine.js";
import Command from "./command.js";
import isDeffer from "./utils/isDeffer.js";
import FnDef from "./fnDef.js";
export default class Instruction extends ProgramLine {
    constructor(command, argument) {
        super();
        this.command = command;
        this.argument = argument;
        this.command = command;
        this.argument = argument;
    }
    toMainString() {
        if (typeof this.command === "string") {
            return [this.command];
        }
        else if (this.command === Command.gosub &&
            this.argument instanceof FnDef &&
            this.argument.inline) {
            return this.returnInlinedGoSub();
        }
        else {
            let v = " ";
            if (this.argument) {
                if (isDeffer(this.argument)) {
                    v += this.argument.name;
                }
                else {
                    v += this.argument.toString();
                }
            }
            else {
                v = "";
            }
            return [Command[this.command] + v];
        }
    }
    returnInlinedGoSub() {
        return this.argument.instructions;
    }
    equals(other) {
        return other instanceof Instruction && other.argument === this.argument && other.command === this.command;
    }
}
