import View from "../view.js";
import { getElmById, round } from "../../utils.js";
import { getClosestDateDifferenceMilliseconds, getClosestDateDifference, millisecondsThisYear } from "../../date.js";

const birthday = new Date(2003, 10, 19);
console.log(birthday);


class _CountdownView extends View {
    private yearsElm = getElmById("countdownYears");
    private monthsElm = getElmById("countdownMonths");
    private daysElm = getElmById("countdownDays");
    private hoursElm = getElmById("countdownHours");
    private minutesElm = getElmById("countdownMinutes");
    private secondsElm = getElmById("countdownSeconds");
    private millisecondsElm = getElmById("countdownMilliseconds");
    private totalmillisecondsElm = getElmById("countdownTotalMilliseconds");
    private totalYearsElm = getElmById("countdownTotalYears");

    constructor() {
        super(getElmById("countdown"));
        this.setup();
    }

    private setup() {
        this.requestAnimationFrameCallback();
    }

    private requestAnimationFrameCallback() {
        const now = new Date();

        const diff = getClosestDateDifference(now, birthday);
        const msDiff = getClosestDateDifferenceMilliseconds(now, birthday);

        this.yearsElm.innerText = diff.years.toString();
        this.monthsElm.innerText = diff.months.toString();
        this.daysElm.innerText = diff.days.toString();
        this.hoursElm.innerText = diff.hours.toString();
        this.minutesElm.innerText = diff.minutes.toString();
        this.secondsElm.innerText = diff.seconds.toString();
        this.millisecondsElm.innerText = diff.milliseconds.toString();

        this.totalmillisecondsElm.innerText = msDiff.toString();
        this.totalYearsElm.innerText = (msDiff / millisecondsThisYear()).toString();

        console.log(diff.negative);

        requestAnimationFrame(() => this.requestAnimationFrameCallback());
    }
}

const countdownView = new _CountdownView();
export default countdownView;