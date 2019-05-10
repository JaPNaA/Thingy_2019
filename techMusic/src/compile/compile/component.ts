import SymbolLine from "./symbol/line.js";
import ProgramLine from "./programLine.js";
import FnDef from "./fnDef.js";
import ILetLine from "./iLet.js";
import Define from "./define.js";

export default class ProgramComponent {
    constructor(public name: string) { }
    public appendToDefines(defines: Define[]): void { }
    public appendToSymbols(symbolLines: SymbolLine[]): void { }
    public appendToLets(letLines: ILetLine[]): void { }
    public appendToLines(lines: ProgramLine[][]): void { }
    public appendToFnDefs(fnDefs: FnDef[]): void { }
};