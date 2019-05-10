import ProgramComponent from "./component.js";
import SymbolB from "./symbol/b.js";
import FnDef from "./fnDef.js";
import SymbolQ from "./symbol/q.js";
import DynamicLet from "./dynamicLet.js";
const pushStackFuncTemplate = `
poke stackPtr#, temp#
inc stackPtr#
`;
const popStackFuncTemplate = `
dec stackPtr#
peek stackPtr#, temp#
`;
function useTemplate(template, num) {
    return template
        .trim()
        .replace(/#/g, num.toString())
        .split("\n");
}
export default class Stack extends ProgramComponent {
    constructor(numArg) {
        let num;
        if (numArg === undefined) {
            num = '';
        }
        else {
            num = numArg.toString();
        }
        super("stack" + num);
        this.fnNames = [];
        this.num = num;
        this.alloc = new SymbolQ();
    }
    appendToSymbols(symbols) {
        symbols.push(new SymbolB("stackPtr" + this.num));
        symbols.push(this.alloc);
    }
    appendToLets(lets) {
        lets.push(new DynamicLet("stackPtr" + this.num, () => { return this.alloc.value; }));
    }
    appendToFnDefs(fnDefs) {
        const pushStack = "pushStack" + this.num;
        const popStack = "popStack" + this.num;
        this.fnNames.push(pushStack, popStack);
        fnDefs.push(new FnDef(pushStack, useTemplate(pushStackFuncTemplate, this.num)));
        fnDefs.push(new FnDef(popStack, useTemplate(popStackFuncTemplate, this.num)));
    }
}
