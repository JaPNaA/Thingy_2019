import Instruction from "./instruction.js";
import Command from "./command.js";
import Deffer from "./deffer.js";
import ILetLine from "./iLet.js";

export default class DynamicLet extends Instruction implements ILetLine {
    public name: string;
    public statement: () => string | number;

    constructor(name_: string | Deffer, statement: () => string | number) {
        let name: string;
        if (typeof name_ === 'string') {
            name = name_;
        } else {
            name = name_.name;
        }

        super(Command.let, name + " = " + statement);
        this.statement = statement;
        this.name = name;
    }

    protected toMainString(): string[] {
        return ["let " + this.name + " = " + this.statement()];
    }
}