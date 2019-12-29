import CalendarWalker from "./CalendarWalker.js";
;
export var dateDiffNumbersKeys = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds"];
export function getClosestDateDifference(a, b) {
    var closest = getClosestYearlyDate(a, b);
    return dateDiff(closest, a);
}
export function getClosestDateDifferenceMilliseconds(a, b) {
    var closest = getClosestYearlyDate(a, b);
    return closest.getTime() - a.getTime();
}
export function dateDiff(a_, b_) {
    var a, b;
    var negative;
    if (a_.getTime() < b_.getTime()) {
        negative = true;
        a = a_;
        b = b_;
    }
    else {
        negative = false;
        a = b_;
        b = a_;
    }
    var walker = new CalendarWalker(a);
    walker.walkToDate(b);
    var diff = walker.distWalked;
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
export function getTotalYearDiff(a, b) {
    var firstYear = a.getFullYear();
    var firstYearMs = createDateWithYear(firstYear).getTime();
    var msInFirstYear = getMillisecondsInYear(firstYear);
    var startYearDiff = 1 - (a.getTime() - firstYearMs) / msInFirstYear;
    var lastYear = b.getFullYear();
    var lastYearMs = createDateWithYear(lastYear).getTime();
    var msInLastYear = getMillisecondsInYear(lastYear);
    var lastYearDiff = (b.getTime() - lastYearMs) / msInLastYear;
    return startYearDiff + lastYearDiff + (lastYear - firstYear - 1);
}
export function getDaysInMonth(month) {
    var end = new Date(month.getFullYear(), month.getMonth() + 1, -1);
    return end.getDate();
}
export function getClosestYearlyDate(now, date) {
    var dateTime = date.getTime();
    var dateThisYear = new Date(date.getTime());
    dateThisYear.setFullYear(now.getFullYear());
    if (now.getTime() > dateThisYear.getTime()) {
        var dateNextYear = new Date(dateTime);
        dateNextYear.setFullYear(now.getFullYear() + 1);
        return closestDate(now, dateNextYear, dateThisYear);
    }
    else {
        var dateLastYear = new Date(dateTime);
        dateLastYear.setFullYear(now.getFullYear() - 1);
        return closestDate(now, dateLastYear, dateThisYear);
    }
}
function getMillisecondsInYear(year) {
    var start = createDateWithYear(year);
    var end = createDateWithYear(year + 1);
    return end.getTime() - start.getTime();
}
function createDateWithYear(year) {
    return new Date(year, 0, 1, 0, 0, 0, 0);
}
function closestDate(ref, a, b) {
    var refTime = ref.getTime();
    if (Math.abs(a.getTime() - refTime) >
        Math.abs(b.getTime() - refTime)) {
        return b;
    }
    else {
        return a;
    }
}
