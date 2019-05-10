import Instruction from "./instruction.js";
import Command from "./command.js";
export default class LetLine extends Instruction {
    constructor(name_, statement) {
        let name;
        if (typeof name_ === 'string') {
            name = name_;
        }
        else {
            name = name_.name;
        }
        super(Command.let, name + " = " + statement);
        this.statement = statement;
        this.name = name;
    }
    toMainString() {
        return ["let " + this.name + " = " + this.statement];
    }
}
