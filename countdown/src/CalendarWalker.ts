import { DateDiff } from "./date.js";

export default class CalendarWalker {
    private date: Date;

    public distWalked: DateDiff;

    constructor(startDate: Date) {
        this.date = startDate;

        this.distWalked = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            negative: false
        };
    }

    public walkToDate(date: Date): void {
        this.walkToTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        this.walkToDateOfMonth(date.getDate());
        this.walkToMonth(date.getMonth());
        this.walkToYear(date.getFullYear());
    }

    private walkToYear(fullYear: number): void {
        const distance = fullYear - this.date.getFullYear();
        this.date.setFullYear(fullYear);
        this.distWalked.years += distance;
    }

    private walkToMonth(month: number): void {
        const distance = month - this.date.getMonth();

        this.distWalked.months += distance;
        this.date.setMonth(month);

        while (this.distWalked.months < 0) {
            this.distWalked.years--;
            this.distWalked.months += 12;
        }

        while (this.distWalked.months >= 12) {
            this.distWalked.years++;
            this.distWalked.months -= 12;
        }
    }

    private walkToDateOfMonth(dayOfMonth: number): void {
        const distance = dayOfMonth - this.date.getDate();

        this.distWalked.days += distance;
        this.date.setDate(dayOfMonth);

        while (this.distWalked.days < 0) {
            this.distWalked.days += CalendarWalker.getDaysInMonth(
                this.date.getFullYear() + this.distWalked.years,
                this.date.getMonth() + this.distWalked.months
            );
            this.distWalked.months--;
        }

        while (this.distWalked.days >= 31) {
            this.distWalked.days -= CalendarWalker.getDaysInMonth(
                this.date.getFullYear() + this.distWalked.years,
                this.date.getMonth() + this.distWalked.months
            );
            this.distWalked.months++;
        }
    }

    private walkToTime(hour: number, minute: number, second: number, millisecond: number): void {
        const target = new Date(
            this.date.getFullYear(), this.date.getMonth(), this.date.getDate(),
            hour, minute, second, millisecond).getTime();

        const distance = new Date(target - this.date.getTime());

        while (distance.getTime() < 0) {
            this.distWalked.days--;
            distance.setUTCDate(distance.getUTCDate() + 1);
        }

        while (distance.getUTCDate() > 1) {
            this.distWalked.days++;
            distance.setUTCDate(distance.getUTCDate() - 1);
        }

        this.distWalked.hours = distance.getUTCHours();
        this.distWalked.minutes = distance.getUTCMinutes();
        this.distWalked.seconds = distance.getUTCSeconds();
        this.distWalked.milliseconds = distance.getUTCMilliseconds();
    }

    private static getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }
}
