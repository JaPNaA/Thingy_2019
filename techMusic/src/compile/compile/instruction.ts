import ProgramLine from "./programLine.js";
import { Equalable } from "../../equalable.js";
import Command from "./command.js";
import Deffer from "./deffer.js";
import isDeffer from "./utils/isDeffer.js";
import FnDef from "./fnDef.js";

export default class Instruction extends ProgramLine implements Equalable {
    constructor(str: string)
    constructor(command: Command, argument: string | number | Deffer)
    constructor(public command: Command | string, public argument?: string | number | Deffer) {
        super();

        this.command = command;
        this.argument = argument;
    }

    protected toMainString(): (string | ProgramLine)[] {
        if (typeof this.command === "string") {
            return [this.command];
        } else if (
            this.command === Command.gosub &&
            this.argument instanceof FnDef &&
            this.argument.inline
        ) {
            return this.returnInlinedGoSub();
        } else {
            let v = " ";
            if (this.argument) {
                if (isDeffer(this.argument)) {
                    v += this.argument.name;
                } else {
                    v += this.argument.toString();
                }
            } else {
                v = "";
            }
            return [Command[this.command] + v];
        }
    }

    private returnInlinedGoSub(): (string | ProgramLine)[] {
        return (this.argument as FnDef).instructions;
    }

    public equals(other: any): boolean {
        return other instanceof Instruction && other.argument === this.argument && other.command === this.command;
    }
}