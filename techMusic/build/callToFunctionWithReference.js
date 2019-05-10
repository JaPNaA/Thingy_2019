import Instruction from "./compile/compile/instruction.js";
import Command from "./compile/compile/command.js";
import FnDef from "./compile/compile/fnDef.js";
export function lineIsCallToFunctionWithReference(line) {
    return line instanceof Instruction &&
        line.command === Command.gosub &&
        line.argument instanceof FnDef;
}
