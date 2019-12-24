import View from "../view.js";
import { getElmById, registerResizeHandler } from "../../utils.js";
import { DateDiff, dateDiffNumbersKeys, dateDiff, getTotalYearDiff } from "../../date.js";

class _CountdownView extends View {
    public targetDate: Date = new Date();

    private totalmillisecondsElm = getElmById("countdownTotalMilliseconds");
    private totalYearsElm = getElmById("countdownTotalYears");

    private elms: { [x in keyof DateDiff]: HTMLElement } = {
        years: getElmById("countdownYears"),
        months: getElmById("countdownMonths"),
        days: getElmById("countdownDays"),
        hours: getElmById("countdownHours"),
        minutes: getElmById("countdownMinutes"),
        seconds: getElmById("countdownSeconds"),
        milliseconds: getElmById("countdownMilliseconds"),
        negative: getElmById("countdownNegative")
    };

    private dateDiffNumberDigits: { [x in keyof DateDiff]?: number } = {
        seconds: 2,
        milliseconds: 3
    };
    private totalYearsDecimals = 9;
    private totalYearsDecimalsFactor = Math.pow(10, -this.totalYearsDecimals);

    private firstNonZeroedIndex = 0;

    private requestAnimationFrameHandle: number = -1;

    constructor() {
        super(getElmById("countdown"));
    }

    public open() {
        super.open();
        this.requestAnimationFrameCallback();
        this.resizeHandler();

        location.hash = this.targetDate.getTime().toString();

        registerResizeHandler(() => this.resizeHandler());
    }

    public close() {
        cancelAnimationFrame(this.requestAnimationFrameHandle);
    }

    private resizeHandler(): void {
        this.elm.style.fontSize = Math.max(
            26,
            Math.min(innerWidth * 0.08, innerHeight * 0.1)
        ) + "px";
    }

    private requestAnimationFrameCallback(): void {
        const now = new Date();

        const diff = dateDiff(this.targetDate, now);
        const msDiff = this.targetDate.getTime() - now.getTime();

        if (diff.negative) {
            this.elm.classList.add("negative");
        } else {
            this.elm.classList.remove("negative");
        }

        this.updateElms(diff);
        this.elm.setAttribute("firstnonzero", dateDiffNumbersKeys[this.firstNonZeroedIndex]);

        this.totalmillisecondsElm.innerText = msDiff.toString();
        this.totalYearsElm.innerText =
            this.padDecimals(this.roundWithFactor(
                getTotalYearDiff(now, this.targetDate),
                this.totalYearsDecimalsFactor
            ), this.totalYearsDecimals);

        this.requestAnimationFrameHandle = requestAnimationFrame(() => this.requestAnimationFrameCallback());
    }

    private updateElms(diff: DateDiff): void {
        let i = 0;
        for (; i < dateDiffNumbersKeys.length - 1; i++) {
            const key = dateDiffNumbersKeys[i];
            if (diff[key] !== 0) { break; }
            this.elms[key].innerText = "0";
            this.elms[key].classList.add("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.firstNonZeroedIndex = i;

        for (; i < dateDiffNumbersKeys.length; i++) {
            const key = dateDiffNumbersKeys[i];
            this.elms[key].innerText = this.padStart0(diff[key].toString(), this.dateDiffNumberDigits[key]);
            if (diff[key] === 1) {
                this.elms[key].classList.add("singular");
            } else {
                this.elms[key].classList.remove("singular");
            }
            this.elms[key].classList.remove("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.elms.negative.innerText = diff.negative ? "ago" : "";

        const firstNonZeroed = dateDiffNumbersKeys[this.firstNonZeroedIndex];
        this.elms[firstNonZeroed].classList.add("first");
    }

    private padStart0(str: string, length?: number): string {
        if (!length) { return str; }
        const padLength = length - str.length;
        if (padLength <= 0) { return str; }
        let s = "";
        for (let i = 0; i < padLength; i++) {
            s += "0";
        }
        return s + str;
    }

    private padDecimals(n: number, numDecimalDigits: number): string {
        const decimalsStr = Math.round(Math.abs(n % 1) * (10 ** numDecimalDigits)).toString();
        const padded = this.padStart0(decimalsStr, numDecimalDigits);
        return (n | 0).toString() + "." + padded;
    }

    private roundWithFactor(n: number, to: number): number {
        return Math.round(n / to) / (1 / to);
    }
}

const countdownView = new _CountdownView();
export default countdownView;