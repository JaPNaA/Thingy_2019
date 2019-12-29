import View from "../view.js";
import views from "../views.js";
import countdownView from "./countdownView.js";
import { getElmById, monthStrToIndex } from "../../utils.js";
import { getDaysInMonth, getClosestYearlyDate } from "../../date.js";
import HorizontalSelect from "./startView/HorizontalSelect.js";

class _StartView extends View {
    private form: HTMLFormElement = getElmById("form") as HTMLFormElement;

    private inputNameGetterMap: { [x: string]: () => number } = {
        year: this.getYear,
        month: this.getMonth,
        date: this.getDate,
        hour: this.getHour,
        minute: this.getMinute,
        second: this.getSecond,
        millisecond: this.getMillisecond
    };

    constructor() {
        super(getElmById("start"));
        new HorizontalSelect(getElmById("selectType"));
        this.setup();
    }

    public open() {
        const time = this.getTimeFromLocationHash();
        if (time !== null) {
            countdownView.targetDate = new Date(time);
            views.switch(countdownView);
            return;
        }

        super.open();
    }

    private setup() {
        addEventListener("hashchange", () => {
            views.switch(this);
        });

        this.form.addEventListener("submit", e => {
            e.preventDefault();

            const values = this.getAndValidateInputs();

            let date = new Date(
                values.year, values.month, values.date,
                values.hour, values.minute, values.second,
                values.millisecond
            );

            if (this.getNamedInputValue("type") === "birthday") {
                date = getClosestYearlyDate(new Date(), date);
            }

            countdownView.targetDate = date;

            views.switch(countdownView);
        });
    }

    private getTimeFromLocationHash(): number | null {
        if (!location.hash || location.hash.length < 1) { return null; }
        const afterHash = parseInt(location.hash.slice(1));
        if (isNaN(afterHash)) { return null; }
        return afterHash;
    }

    private getAndValidateInputs(): { [x: string]: number } {
        const keys = Object.keys(this.inputNameGetterMap);
        const obj: { [x: string]: number } = {};

        let valid = true;

        for (const key of keys) {
            const fn = this.inputNameGetterMap[key];

            const input = this.getNamedInput(key);

            try {
                obj[key] = fn.call(this);
                input.parentElement!.classList.remove("invalid");
            } catch (err) {
                input.parentElement!.classList.add("invalid");
                input.parentElement!.setAttribute("reason-invalid", err.message);
                valid = false;
            }
        }

        if (!valid) { throw new Error("Some inputs are invalid"); }
        return obj;
    }

    private getYear(): number {
        const int = parseInt(this.getNamedInputValue("year"));
        if (isNaN(int)) { throw new Error("The year must be a number"); }
        return int;
    }

    private getMonth(): number {
        const str = this.getNamedInputValue("month");
        const intParsed = parseInt(str);
        if (!isNaN(intParsed)) {
            if (intParsed < 1 || intParsed > 12) {
                throw new Error("The month must be a value between 1 and 12");
            } else {
                return intParsed - 1;
            }
        }

        const index = monthStrToIndex(str);
        return index;
    }

    private getDate(): number {
        const date = parseInt(this.getNamedInputValue("date"));
        if (isNaN(date)) { throw new Error("The date must be a number"); }

        let max;

        try {
            max = getDaysInMonth(new Date(this.getYear(), this.getMonth()));
        } catch (err) {
            max = 31;
        }

        if (date < 1 || date > max) {
            throw new Error("The date must be a value between 1 and " + max);
        }

        return date;
    }

    private getHour(): number {
        return this.parseAndValidateSimple("hour", 23, 0, 0);
    }

    private getMinute(): number {
        return this.parseAndValidateSimple("minute", 59, 0, 0);
    }

    private getSecond(): number {
        return this.parseAndValidateSimple("second", 59, 0, 0);
    }

    private getMillisecond(): number {
        return this.parseAndValidateSimple("millisecond", 999, 0, 0);
    }

    private parseAndValidateSimple(inputName: string, maxValue: number, minValue: number, defaultValue: number): number {
        const inputValue = this.getNamedInputValue(inputName);
        if (inputValue === "") { return defaultValue; }

        const intParsed = parseInt(inputValue);
        if (isNaN(intParsed)) {
            throw new Error("The " + inputName + " must be a number");
        }

        if (intParsed < minValue || intParsed > maxValue) {
            throw new Error(
                "The " + inputName + " must be between " +
                minValue + " and " + maxValue
            );
        }

        return intParsed;
    }

    private getNamedInput(name: string): HTMLInputElement {
        return this.form.elements.namedItem(name) as HTMLInputElement;
    }

    private getNamedInputValue(name: string): string {
        return (this.form.elements.namedItem(name) as HTMLInputElement).value;
    }
}

const startView = new _StartView();
export default startView;