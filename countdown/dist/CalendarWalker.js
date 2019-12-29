var CalendarWalker = (function () {
    function CalendarWalker(startDate) {
        this.date = new Date(startDate.getTime());
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
    CalendarWalker.prototype.walkToDate = function (date) {
        this.walkToTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
        this.walkToDateOfMonth(date.getDate());
        this.walkToMonth(date.getMonth());
        this.walkToYear(date.getFullYear());
    };
    CalendarWalker.prototype.walkToYear = function (fullYear) {
        var distance = fullYear - this.date.getFullYear();
        this.date.setFullYear(fullYear);
        this.distWalked.years += distance;
    };
    CalendarWalker.prototype.walkToMonth = function (month) {
        var distance = month - this.date.getMonth();
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
    };
    CalendarWalker.prototype.walkToDateOfMonth = function (dayOfMonth) {
        var distance = dayOfMonth - this.date.getDate();
        this.distWalked.days += distance;
        this.date.setDate(dayOfMonth);
        while (this.distWalked.days < 0) {
            this.distWalked.days += CalendarWalker.getDaysInMonth(this.date.getFullYear() + this.distWalked.years, this.date.getMonth() + this.distWalked.months);
            this.distWalked.months--;
        }
        while (this.distWalked.days >= 31) {
            this.distWalked.days -= CalendarWalker.getDaysInMonth(this.date.getFullYear() + this.distWalked.years, this.date.getMonth() + this.distWalked.months);
            this.distWalked.months++;
        }
    };
    CalendarWalker.prototype.walkToTime = function (hour, minute, second, millisecond) {
        var target = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), hour, minute, second, millisecond).getTime();
        var distance = new Date(target - this.date.getTime());
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
    };
    CalendarWalker.getDaysInMonth = function (year, month) {
        return new Date(year, month + 1, 0).getDate();
    };
    return CalendarWalker;
}());
export default CalendarWalker;
