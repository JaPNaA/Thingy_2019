interface DateDiff {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
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

//! bug: not accurate
// fix: traverse dates instead of subtracting
function dateDiff(a: Date, b: Date): DateDiff {
    return normalizeDateDiff({
        years: a.getFullYear() - b.getFullYear(),
        months: a.getMonth() - b.getMonth(),
        days: a.getDate() - b.getDate(),
        hours: a.getHours() - b.getHours(),
        minutes: a.getMinutes() - b.getMinutes(),
        seconds: a.getSeconds() - b.getSeconds(),
        milliseconds: a.getMilliseconds() - b.getMilliseconds()
    });
}

function normalizeDateDiff(dateDiff: DateDiff): DateDiff {
    // console.log(dateDiff);
    const date = new Date(
        dateDiff.years,
        dateDiff.months,
        dateDiff.days,
        dateDiff.hours,
        dateDiff.minutes,
        dateDiff.seconds,
        dateDiff.milliseconds
    );

    return {
        // @ts-ignore get year (deprecated) is required to extract the year difference
        years: date.getYear(),
        months: date.getMonth(),
        days: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds()
    };
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