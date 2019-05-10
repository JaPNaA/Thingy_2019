import ProgramComponent from "./component.js";
import SymbolLine from "./symbol/line.js";
import SymbolB from "./symbol/b.js";
import FnDef from "./fnDef.js";
import SymbolQ from "./symbol/q.js";
import DynamicLet from "./dynamicLet.js";
import ILetLine from "./iLet.js";

const pushStackFuncTemplate = `
poke stackPtr#, temp#
inc stackPtr#
`;

const popStackFuncTemplate = `
dec stackPtr#
peek stackPtr#, temp#
`;

function useTemplate(template: string, num: number | string): string[] {
    return template
        .trim()
        .replace(/#/g, num.toString())
        .split("\n")
}

export default class Stack extends ProgramComponent {
    public num: string;
    public alloc: SymbolQ;
    public fnNames: string[];

    constructor(numArg?: number) {
        let num;

        if (numArg === undefined) {
            num = '';
        } else {
            num = numArg.toString();
        }

        super("stack" + num);

        this.fnNames = [];
        this.num = num;
        this.alloc = new SymbolQ();
    }

    public appendToSymbols(symbols: SymbolLine[]): void {
        symbols.push(new SymbolB("stackPtr" + this.num));
        symbols.push(this.alloc);
    }

    public appendToLets(lets: ILetLine[]): void {
        lets.push(new DynamicLet(
            "stackPtr" + this.num,
            () => { return this.alloc.value as string }
        ));
    }

    public appendToFnDefs(fnDefs: FnDef[]): void {
        const pushStack = "pushStack" + this.num;
        const popStack = "popStack" + this.num;

        this.fnNames.push(pushStack, popStack);

        fnDefs.push(new FnDef(pushStack, useTemplate(pushStackFuncTemplate, this.num)));
        fnDefs.push(new FnDef(popStack, useTemplate(popStackFuncTemplate, this.num)));
    }
}