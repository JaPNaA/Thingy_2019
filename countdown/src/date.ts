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

export const dateDiffNumbersKeys: readonly (keyof DateDiff)[] = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"];

export function getClosestDateDifference(a: Date, b: Date): DateDiff {
    const closest = getClosestYearlyDate(a, b);
    return dateDiff(closest, a);
}

export function getClosestDateDifferenceMilliseconds(a: Date, b: Date): number {
    const closest = getClosestYearlyDate(a, b);
    return closest.getTime() - a.getTime();
}

export function dateDiff(a_: Date, b_: Date): DateDiff {
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

export function getTotalYearDiff(a: Date, b: Date) {
    const firstYear = a.getFullYear();
    const firstYearMs = createDateWithYear(firstYear).getTime();
    const msInFirstYear = getMillisecondsInYear(firstYear);
    const startYearDiff = 1 - (a.getTime() - firstYearMs) / msInFirstYear;
    
    const lastYear = b.getFullYear();
    const lastYearMs = createDateWithYear(lastYear).getTime();
    const msInLastYear = getMillisecondsInYear(lastYear);
    const lastYearDiff = (b.getTime() - lastYearMs) / msInLastYear;

    return startYearDiff + lastYearDiff + (lastYear - firstYear - 1);
}

export function getDaysInMonth(month: Date): number {
    const end = new Date(month.getFullYear(), month.getMonth() + 1, -1);
    return end.getDate();
}

export function getClosestYearlyDate(now: Date, date: Date): Date {
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

function getMillisecondsInYear(year: number) {
    const start = createDateWithYear(year);
    const end = createDateWithYear(year + 1);
    return end.getTime() - start.getTime();
}

function createDateWithYear(year: number) {
    return new Date(year, 0, 1, 0, 0, 0, 0);
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