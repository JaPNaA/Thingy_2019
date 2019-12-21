import View from "../view.js";
import { getElmById } from "../../utils.js";
import { getClosestDateDifferenceMilliseconds, getClosestDateDifference, millisecondsThisYear, DateDiff, dateDiffNumbersKeys } from "../../date.js";

const birthday = new Date();
birthday.setTime(birthday.getTime() + 5000);
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

        const diff = getClosestDateDifference(now, birthday);
        const msDiff = getClosestDateDifferenceMilliseconds(now, birthday);

        if (diff.negative) {
            this.elm.classList.add("negative");
        } else {
            this.elm.classList.remove("negative");
        }

        this.updateElms(diff);

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
        }

        for (; i < dateDiffNumbersKeys.length; i++) {
            const key = dateDiffNumbersKeys[i];
            this.elms[key].innerText = diff[key].toString();
            this.elms[key].classList.remove("leadingZero");
        }

        this.elms.negative.innerText = diff.negative ? "ago" : "";
    }
}

const countdownView = new _CountdownView();
export default countdownView;