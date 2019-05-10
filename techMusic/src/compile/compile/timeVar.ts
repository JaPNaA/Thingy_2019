import ProgramComponent from "./component.js";
import Deffer from "./deffer.js";
import SymbolLine from "./symbol/line.js";
import LetLine from "./let.js";
import SymbolW from "./symbol/w.js";

export default class TimeVar extends ProgramComponent implements Deffer {
    public static prefix: string = "T";
    public name: string;
    public length: number;
    public useLet: boolean = false;
    private value: number = 0;

    constructor(public numerator: number, public demononator: number, public factor: number, public offset?: number) {
        super(numerator.toString());
        this.name = TimeVar.prefix + this.numerator;
        this.length = numerator / demononator;
    }

    public appendToSymbols(symbols: SymbolLine[]): void {
        let value = this.factor * this.numerator / this.demononator;
        let comment = `beatLength * ${this.numerator} / ${this.demononator}`;
        if (this.offset) {
            value += this.offset;
            comment += this.offset < 0 ? " - " + (-this.offset) : " + " + this.offset;
        }

        comment += ", rounded";

        if (value > 255) {
            this.value = value;
            this.useLet = true;
            symbols.push(new SymbolW(this.name, comment));
        } else {
            const symbol = new SymbolLine(this.name, Math.round(value).toString(), comment);
            symbol.order = 2;
            symbols.push(symbol);
        }
    }

    public appendToLets(lets: LetLine[]): void {
        if (this.useLet) {
            lets.push(new LetLine(this.name, Math.round(this.value).toString()));
        }
    }
}