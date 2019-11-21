interface DateDiff {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export function dateDiffToString(dateDiff: DateDiff): string {
    const diffs = [];

    if (dateDiff.years !== 0) { diffs.push(dateDiff.years + " years"); }
    if (dateDiff.months !== 0) { diffs.push(dateDiff.months + " months"); }
    if (dateDiff.days !== 0) { diffs.push(dateDiff.days + " days"); }
    if (dateDiff.hours !== 0) { diffs.push(dateDiff.hours + " hours"); }
    if (dateDiff.minutes !== 0) { diffs.push(dateDiff.minutes + " minutes"); }
    if (dateDiff.seconds !== 0) { diffs.push(dateDiff.seconds + " seconds"); }
    if (dateDiff.milliseconds !== 0) { diffs.push(dateDiff.milliseconds + " milliseconds"); }

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