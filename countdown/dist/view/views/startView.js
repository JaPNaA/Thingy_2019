var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import View from "../view.js";
import views from "../views.js";
import countdownView from "./countdownView.js";
import { getElmById, monthStrToIndex } from "../../utils.js";
import { getDaysInMonth, getClosestYearlyDate } from "../../date.js";
import HorizontalSelect from "./startView/HorizontalSelect.js";
var _StartView = (function (_super) {
    __extends(_StartView, _super);
    function _StartView() {
        var _this = _super.call(this, getElmById("start")) || this;
        _this.form = getElmById("form");
        _this.inputNameGetterMap = {
            year: _this.getYear,
            month: _this.getMonth,
            date: _this.getDate,
            hour: _this.getHour,
            minute: _this.getMinute,
            second: _this.getSecond,
            millisecond: _this.getMillisecond
        };
        new HorizontalSelect(getElmById("selectType"));
        _this.setup();
        return _this;
    }
    _StartView.prototype.open = function () {
        var time = this.getTimeFromLocationHash();
        if (time !== null) {
            countdownView.targetDate = new Date(time);
            views.switch(countdownView);
            return;
        }
        _super.prototype.open.call(this);
    };
    _StartView.prototype.setup = function () {
        var _this = this;
        addEventListener("hashchange", function () {
            views.switch(_this);
        });
        this.form.addEventListener("submit", function (e) {
            e.preventDefault();
            var values = _this.getAndValidateInputs();
            var date = new Date(values.year, values.month, values.date, values.hour, values.minute, values.second, values.millisecond);
            if (_this.getNamedInputValue("type") === "birthday") {
                date = getClosestYearlyDate(new Date(), date);
            }
            countdownView.targetDate = date;
            views.switch(countdownView);
        });
    };
    _StartView.prototype.getTimeFromLocationHash = function () {
        if (!location.hash || location.hash.length < 1) {
            return null;
        }
        var afterHash = parseInt(location.hash.slice(1));
        if (isNaN(afterHash)) {
            return null;
        }
        return afterHash;
    };
    _StartView.prototype.getAndValidateInputs = function () {
        var keys = Object.keys(this.inputNameGetterMap);
        var obj = {};
        var valid = true;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var fn = this.inputNameGetterMap[key];
            var input = this.getNamedInput(key);
            try {
                obj[key] = fn.call(this);
                input.parentElement.classList.remove("invalid");
            }
            catch (err) {
                input.parentElement.classList.add("invalid");
                input.parentElement.setAttribute("reason-invalid", err.message);
                valid = false;
            }
        }
        if (!valid) {
            throw new Error("Some inputs are invalid");
        }
        return obj;
    };
    _StartView.prototype.getYear = function () {
        var int = parseInt(this.getNamedInputValue("year"));
        if (isNaN(int)) {
            throw new Error("The year must be a number");
        }
        return int;
    };
    _StartView.prototype.getMonth = function () {
        var str = this.getNamedInputValue("month");
        var intParsed = parseInt(str);
        if (!isNaN(intParsed)) {
            if (intParsed < 1 || intParsed > 12) {
                throw new Error("The month must be a value between 1 and 12");
            }
            else {
                return intParsed - 1;
            }
        }
        var index = monthStrToIndex(str);
        return index;
    };
    _StartView.prototype.getDate = function () {
        var date = parseInt(this.getNamedInputValue("date"));
        if (isNaN(date)) {
            throw new Error("The date must be a number");
        }
        var max;
        try {
            max = getDaysInMonth(new Date(this.getYear(), this.getMonth()));
        }
        catch (err) {
            max = 31;
        }
        if (date < 1 || date > max) {
            throw new Error("The date must be a value between 1 and " + max);
        }
        return date;
    };
    _StartView.prototype.getHour = function () {
        return this.parseAndValidateSimple("hour", 23, 0, 0);
    };
    _StartView.prototype.getMinute = function () {
        return this.parseAndValidateSimple("minute", 59, 0, 0);
    };
    _StartView.prototype.getSecond = function () {
        return this.parseAndValidateSimple("second", 59, 0, 0);
    };
    _StartView.prototype.getMillisecond = function () {
        return this.parseAndValidateSimple("millisecond", 999, 0, 0);
    };
    _StartView.prototype.parseAndValidateSimple = function (inputName, maxValue, minValue, defaultValue) {
        var inputValue = this.getNamedInputValue(inputName);
        if (inputValue === "") {
            return defaultValue;
        }
        var intParsed = parseInt(inputValue);
        if (isNaN(intParsed)) {
            throw new Error("The " + inputName + " must be a number");
        }
        if (intParsed < minValue || intParsed > maxValue) {
            throw new Error("The " + inputName + " must be between " +
                minValue + " and " + maxValue);
        }
        return intParsed;
    };
    _StartView.prototype.getNamedInput = function (name) {
        return this.form.elements.namedItem(name);
    };
    _StartView.prototype.getNamedInputValue = function (name) {
        return this.form.elements.namedItem(name).value;
    };
    return _StartView;
}(View));
var startView = new _StartView();
export default startView;
