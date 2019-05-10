import Instruction from "./compile/compile/instruction.js";
import Command from "./compile/compile/command.js";
import FnDef from "./compile/compile/fnDef.js";

export interface CallToFunctionWithReference extends Instruction {
    command: Command.gosub,
    argument: FnDef
}

export function lineIsCallToFunctionWithReference(line: any): line is CallToFunctionWithReference {
    return line instanceof Instruction &&
        line.command === Command.gosub &&
        line.argument instanceof FnDef
}