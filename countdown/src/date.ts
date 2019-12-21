import CalendarWalker from "./CalendarWalker.js";

export interface DateDiff {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    negative: boolean;
};

const dateDiffKeys: (keyof DateDiff)[] = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"];

export function dateDiffToString(dateDiff: DateDiff): string {
    const diffs = [];

    let ignoring = true;

    for (let i = 0; i < dateDiffKeys.length; i++) {
        const key = dateDiffKeys[i];
        if (dateDiff[key] !== 0) {
            ignoring = false;
        }

        if (ignoring) { continue; }

        diffs.push(dateDiff[key].toString() + " " + key);
    }

    // if (dateDiff.years)

    return diffs.join(", ");
}

export function getClosestDateDifference(a: Date, b: Date): DateDiff {
    const closest = getClosestYearlyDate(a, b);
    return dateDiff(closest, a);
}

export function getClosestDateDifferenceMilliseconds(a: Date, b: Date): number {
    const closest = getClosestYearlyDate(a, b);
    return closest.getTime() - a.getTime();
}

function dateDiff(a_: Date, b_: Date): DateDiff {
    let a: Date, b: Date;
    let negative: boolean;

    if (a_.getTime() < b_.getTime()) {
        negative = true;
        a = a_;
        b = b_;
    } else {
        negative = false;
        a = b_;
        b = a_;
    }

    const walker = new CalendarWalker(a);
    walker.walkToDate(b);
    const diff = walker.distWalked;

    return {
        years: diff.years,
        months: diff.months,
        days: diff.days,
        hours: diff.hours,
        minutes: diff.minutes,
        seconds: diff.seconds,
        milliseconds: diff.milliseconds,
        negative: negative
    };
}

function getClosestYearlyDate(now: Date, date: Date): Date {
    const dateTime = date.getTime();
    const dateThisYear = new Date(date.getTime());

    dateThisYear.setFullYear(now.getFullYear());

    if (now.getTime() > dateThisYear.getTime()) {
        // date passed this year
        // check next year and this year

        const dateNextYear = new Date(dateTime);
        dateNextYear.setFullYear(now.getFullYear() + 1);

        return closestDate(now, dateNextYear, dateThisYear);
    } else {
        // date hasn't passed this year
        // check last year and this year
        const dateLastYear = new Date(dateTime);
        dateLastYear.setFullYear(now.getFullYear() - 1);

        return closestDate(now, dateLastYear, dateThisYear);
    }
}

export function millisecondsThisYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
    return start.getTime() - end.getTime();
}

function closestDate(ref: Date, a: Date, b: Date): Date {
    const refTime = ref.getTime();

    if (
        Math.abs(a.getTime() - refTime) >
        Math.abs(b.getTime() - refTime)
    ) {
        return b;
    } else {
        return a;
    }
}