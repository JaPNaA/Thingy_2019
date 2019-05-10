import ProgramComponent from "./component.js";
import SymbolLine from "./symbol/line.js";
import LetLine from "./let.js";
import SymbolW from "./symbol/w.js";
export default class TimeVar extends ProgramComponent {
    constructor(numerator, demononator, factor, offset) {
        super(numerator.toString());
        this.numerator = numerator;
        this.demononator = demononator;
        this.factor = factor;
        this.offset = offset;
        this.useLet = false;
        this.value = 0;
        this.name = TimeVar.prefix + this.numerator;
        this.length = numerator / demononator;
    }
    appendToSymbols(symbols) {
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
        }
        else {
            const symbol = new SymbolLine(this.name, Math.round(value).toString(), comment);
            symbol.order = 2;
            symbols.push(symbol);
        }
    }
    appendToLets(lets) {
        if (this.useLet) {
            lets.push(new LetLine(this.name, Math.round(this.value).toString()));
        }
    }
}
TimeVar.prefix = "T";
