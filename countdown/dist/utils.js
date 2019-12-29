export function round(number, factor) {
    return Math.round(number / factor) / (1 / factor);
}
export function getElmById(id) {
    var elm = document.getElementById(id);
    if (!elm) {
        throw new Error("element with id '" + id + "' does not exist");
    }
    return elm;
}
export function registerResizeHandler(handler) {
    var lastInnerWidth = innerWidth;
    var lastInnerHeight = innerHeight;
    var remainingChecks = 0;
    function checkResize() {
        if (lastInnerWidth === innerWidth &&
            lastInnerHeight === innerHeight) {
            if (remainingChecks > 0) {
                requestAnimationFrame(function () { return checkResize(); });
                remainingChecks--;
            }
        }
        else {
            handler();
            lastInnerWidth = innerWidth;
            lastInnerHeight = innerHeight;
        }
    }
    addEventListener("resize", function () {
        remainingChecks = 120;
        checkResize();
    });
}
export function toggleClass(elm, className) {
    if (elm.classList.contains(className)) {
        elm.classList.remove(className);
    }
    else {
        elm.classList.add(className);
    }
}
export function monthStrToIndex(str) {
    var matchIndex = -1;
    for (var i = 0, length_1 = months.length; i < length_1; i++) {
        var score = fuzzyStartsWith(str, months[i]);
        if (score > 0) {
            if (matchIndex >= 0) {
                throw new Error("Ambiguous, could be '" +
                    months[matchIndex] +
                    "' or '" +
                    months[i] +
                    "'");
            }
            else {
                matchIndex = i;
            }
        }
    }
    if (matchIndex < 0) {
        throw new Error("Could not find a matching month");
    }
    return matchIndex;
}
var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
function fuzzyStartsWith(start, str) {
    var strLength = str.length;
    var startLower = start.toLowerCase();
    var strLower = str.toLowerCase();
    var currStrIndex = 0;
    var skipped = 0;
    outer: for (var _i = 0, startLower_1 = startLower; _i < startLower_1.length; _i++) {
        var char = startLower_1[_i];
        for (; currStrIndex < strLength;) {
            if (strLower[currStrIndex] === char) {
                currStrIndex++;
                continue outer;
            }
            else {
                skipped++;
                currStrIndex++;
            }
        }
        return 0;
    }
    return (currStrIndex - skipped) / currStrIndex;
}
