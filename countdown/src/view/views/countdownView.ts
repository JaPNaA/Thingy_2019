import View from "../view.js";
import { getElmById, round } from "../../utils.js";
import { getClosestDateDifferenceMilliseconds, dateDiffToString, getClosestDateDifference, millisecondsThisYear } from "../../date.js";

const birthday = new Date(2020, 0, 1);
console.log(birthday);


class _CountdownView extends View {
    private timerElm = getElmById("timer");

    constructor() {
        super(getElmById("countdown"));
        this.setup();
    }

    private setup() {
        this.requestAnimationFrameCallback();
    }

    private requestAnimationFrameCallback() {
        const now = new Date();

        const msDiff = getClosestDateDifferenceMilliseconds(now, birthday);

        this.timerElm.innerText =
            dateDiffToString(
                getClosestDateDifference(now, birthday)
            ) +
            " (" + msDiff + " milliseconds, " + round(msDiff / millisecondsThisYear(), 0.0001) + " years)";

        requestAnimationFrame(() => this.requestAnimationFrameCallback());
    }
}

const countdownView = new _CountdownView();
export default countdownView;