export function round(number: number, factor: number): number {
    return Math.round(number / factor) / (1 / factor);
}

export function getElmById(id: string): HTMLElement {
    const elm = document.getElementById(id);
    if (!elm) { throw new Error("element with id '" + id + "' does not exist") }
    return elm;
}

export function registerResizeHandler(handler: () => void): void {
    let lastInnerWidth = innerWidth;
    let lastInnerHeight = innerHeight;
    let remainingChecks = 0;

    function checkResize() {
        if (
            lastInnerWidth === innerWidth &&
            lastInnerHeight === innerHeight
        ) {
            // ios resize handling
            if (remainingChecks > 0) {
                requestAnimationFrame(() => checkResize());
                remainingChecks--;
            }
        } else {
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

export function toggleClass(elm: HTMLElement, className: string): void {
    if (elm.classList.contains(className)) {
        elm.classList.remove(className);
    } else {
        elm.classList.add(className);
    }
}

/**
 * Attempts to parse month string
 * 
 * "jan" -> 0
 * "dec" -> 11
 * 
 * throws an error if the string is ambiguous or
 * if there was no match
 * 
 * @param str month
 * @returns number [0..11]
 */
export function monthStrToIndex(str: string): number {
    let matchIndex = -1;

    for (let i = 0, length = months.length; i < length; i++) {
        const score = fuzzyStartsWith(str, months[i]);
        if (score > 0) {
            if (matchIndex >= 0) {
                throw new Error(
                    "Ambiguous, could be '" +
                    months[matchIndex] +
                    "' or '" +
                    months[i] +
                    "'"
                );
            } else {
                matchIndex = i;
            }
        }
    }

    if (matchIndex < 0) {
        throw new Error("Could not find a matching month");
    }

    return matchIndex;
}

const months = [
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

// modified from japnaa.github.io
function fuzzyStartsWith(start: string, str: string): number {
    const strLength = str.length;
    const startLower = start.toLowerCase();
    const strLower = str.toLowerCase();
    let currStrIndex = 0;
    let skipped = 0;

    outer: for (const char of startLower) {
        for (; currStrIndex < strLength;) {
            if (strLower[currStrIndex] === char) {
                currStrIndex++;
                continue outer;
            } else {
                skipped++;
                currStrIndex++;
            }
        }

        return 0;
    }

    return (currStrIndex - skipped) / currStrIndex;
}