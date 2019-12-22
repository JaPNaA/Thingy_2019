import View from "../view.js";
import { getElmById } from "../../utils.js";
import { getClosestDateDifferenceMilliseconds, getClosestDateDifference, millisecondsThisYear, DateDiff, dateDiffNumbersKeys, dateDiff } from "../../date.js";

const birthday = new Date("2019/12/21 8:42:30 PM");
// birthday.setTime(birthday.getTime() + 5000);
console.log(birthday);


class _CountdownView extends View {
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

    private firstNonZeroedIndex = 0;

    private requestAnimationFrameHandle: number = -1;

    constructor() {
        super(getElmById("countdown"));
    }

    public open() {
        super.open();
        this.requestAnimationFrameCallback();
    }

    public close() {
        cancelAnimationFrame(this.requestAnimationFrameHandle);
    }

    private requestAnimationFrameCallback(): void {
        const now = new Date();
        const nowPlusABit = new Date(now.getTime() + 3100000000000);

        const diff = dateDiff(nowPlusABit, now);
        const msDiff = getClosestDateDifferenceMilliseconds(now, birthday);

        if (diff.negative) {
            this.elm.classList.add("negative");
        } else {
            this.elm.classList.remove("negative");
        }

        this.updateElms(diff);
        this.elm.setAttribute("firstnonzero", dateDiffNumbersKeys[this.firstNonZeroedIndex]);

        this.totalmillisecondsElm.innerText = msDiff.toString();
        this.totalYearsElm.innerText = (msDiff / millisecondsThisYear()).toString();

        this.requestAnimationFrameHandle = requestAnimationFrame(() => this.requestAnimationFrameCallback());
    }

    private updateElms(diff: DateDiff): void {
        let i = 0;
        for (; i < dateDiffNumbersKeys.length; i++) {
            const key = dateDiffNumbersKeys[i];
            if (diff[key] !== 0) { break; }
            this.elms[key].innerText = "0";
            this.elms[key].classList.add("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.firstNonZeroedIndex = i;

        for (; i < dateDiffNumbersKeys.length; i++) {
            const key = dateDiffNumbersKeys[i];
            this.elms[key].innerText = diff[key].toString();
            this.elms[key].classList.remove("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.elms.negative.innerText = diff.negative ? "ago" : "";

        const firstNonZeroed = dateDiffNumbersKeys[this.firstNonZeroedIndex];
        if (firstNonZeroed) {
            this.elms[firstNonZeroed].classList.add("first");
        } else {
            this.elms[dateDiffNumbersKeys[dateDiffNumbersKeys.length - 1]].classList.add("first");
        }
    }
}

const countdownView = new _CountdownView();
export default countdownView;