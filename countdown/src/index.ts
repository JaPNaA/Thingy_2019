import { getClosestDateDifferenceMilliseconds, dateDiffToString, getClosestDateDifference, millisecondsThisYear } from "./date.js";
import { round } from "./utils.js";

const birthday = new Date(2003, 10, 28);

function requestAnimationFrameCallback() {
    const now = new Date();

    const msDiff = getClosestDateDifferenceMilliseconds(now, birthday);

    // document.body.innerText =
    //     dateDiffToString(
    //         getClosestDateDifference(now, birthday)
    //     ) +
    //     " (" + msDiff + " milliseconds, " + round(msDiff / millisecondsThisYear(), 0.0001) + " years)";

    requestAnimationFrame(requestAnimationFrameCallback);
}

requestAnimationFrameCallback();