var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import View from "../view.js";
import { addKonamiCodeListener, getElmById, registerResizeHandler, toggleClass } from "../../utils.js";
import { dateDiffNumbersKeys, dateDiff, getTotalYearDiff } from "../../date.js";
import views from "../views.js";
import startView from "./startView.js";
import BackgroundCanvas from "./countdownView/BackgroundCanvas.js";
var _CountdownView = (function (_super) {
    __extends(_CountdownView, _super);
    function _CountdownView() {
        var _this = _super.call(this, getElmById("countdown")) || this;
        _this.targetDate = new Date();
        _this.backgroundCanvas = new BackgroundCanvas(getElmById("backgroundCanvas"));
        _this.totalmillisecondsElm = getElmById("countdownTotalMilliseconds");
        _this.totalYearsElm = getElmById("countdownTotalYears");
        _this.totalMillenniaEasterEgg = getElmById("countdownTotalMillenniaEasterEgg");
        _this.totalMillenniaEasterEggEnabled = false;
        _this.actionReset = getElmById("timerActionReset");
        _this.actionDark = getElmById("timerActionDark");
        _this.actionBackground = getElmById("timerActionBackground");
        _this.actionFullscreen = getElmById("timerActionFullscreen");
        _this.actionFooter = getElmById("timerActionFooter");
        _this.elms = {
            years: getElmById("countdownYears"),
            months: getElmById("countdownMonths"),
            days: getElmById("countdownDays"),
            hours: getElmById("countdownHours"),
            minutes: getElmById("countdownMinutes"),
            seconds: getElmById("countdownSeconds"),
            milliseconds: getElmById("countdownMilliseconds"),
            negative: getElmById("countdownNegative")
        };
        _this.dateDiffNumberDigits = {
            seconds: 2,
            milliseconds: 3
        };
        _this.totalYearsDecimals = 9;
        _this.totalYearsDecimalsFactor = Math.pow(10, -_this.totalYearsDecimals);
        _this.firstNonZeroedIndex = 0;
        _this.requestAnimationFrameHandle = -1;
        _this.actionTimeoutHandle = -1;
        _this.isDark = false;
        _this.isBackgroundEnabled = true;
        addKonamiCodeListener(function () {
            _this.totalMillenniaEasterEggEnabled = true;
            _this.totalMillenniaEasterEgg.classList.remove("hidden");
        });
        _this.setup();
        return _this;
    }
    _CountdownView.prototype.open = function () {
        _super.prototype.open.call(this);
        this.requestAnimationFrameCallback();
        this.resizeHandler();
        location.hash = this.targetDate.getTime().toString();
        addEventListener("mousemove", this.actionHandler);
        addEventListener("mousedown", this.actionHandler);
        addEventListener("touchstart", this.actionHandler);
        addEventListener("touchmove", this.actionHandler);
        this.actionHandler();
    };
    _CountdownView.prototype.close = function () {
        _super.prototype.close.call(this);
        cancelAnimationFrame(this.requestAnimationFrameHandle);
        clearTimeout(this.actionTimeoutHandle);
        removeEventListener("mousemove", this.actionHandler);
        removeEventListener("mousedown", this.actionHandler);
        removeEventListener("touchstart", this.actionHandler);
        removeEventListener("touchmove", this.actionHandler);
    };
    _CountdownView.prototype.setup = function () {
        var _this = this;
        this.actionHandler = this.actionHandler.bind(this);
        registerResizeHandler(function () { return _this.resizeHandler(); });
        if (!document.fullscreenEnabled) {
            this.actionFullscreen.classList.add("disabled");
        }
        this.actionReset.addEventListener("click", function () {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            location.hash = "";
            views.switch(startView);
        });
        this.actionDark.addEventListener("click", function () {
            if (_this.isDark) {
                document.body.classList.remove("dark");
                _this.backgroundCanvas.setColor("#000000");
            }
            else {
                document.body.classList.add("dark");
                _this.backgroundCanvas.setColor("#ffffff");
            }
            _this.isDark = !_this.isDark;
        });
        this.actionBackground.addEventListener("click", function () {
            if (_this.isBackgroundEnabled) {
                _this.elm.classList.add("backgroundDisabled");
            }
            else {
                _this.elm.classList.remove("backgroundDisabled");
            }
            _this.isBackgroundEnabled = !_this.isBackgroundEnabled;
        });
        this.actionFullscreen.addEventListener("click", function () {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            else {
                _this.elm.requestFullscreen();
            }
        });
        this.actionFooter.addEventListener("click", function () {
            toggleClass(_this.elm, "footerHidden");
        });
    };
    _CountdownView.prototype.actionHandler = function () {
        var _this = this;
        this.elm.classList.remove("settled");
        clearTimeout(this.actionTimeoutHandle);
        this.actionTimeoutHandle = setTimeout(function () {
            _this.elm.classList.add("settled");
        }, 4000);
    };
    _CountdownView.prototype.resizeHandler = function () {
        this.backgroundCanvas.resizeHandler();
        this.elm.style.fontSize = Math.max(26, Math.min(innerWidth * 0.08, innerHeight * 0.1)) + "px";
    };
    _CountdownView.prototype.requestAnimationFrameCallback = function () {
        var _this = this;
        var now = new Date();
        var diff = dateDiff(this.targetDate, now);
        var msDiff = this.targetDate.getTime() - now.getTime();
        if (diff.negative) {
            this.elm.classList.add("negative");
        }
        else {
            this.elm.classList.remove("negative");
        }
        this.updateElms(diff);
        this.elm.setAttribute("firstnonzero", dateDiffNumbersKeys[this.firstNonZeroedIndex]);
        if (this.isBackgroundEnabled) {
            this.backgroundCanvas.draw(diff);
        }
        this.totalmillisecondsElm.innerText = msDiff.toString();
        var totalYears = this.roundWithFactor(getTotalYearDiff(now, this.targetDate), this.totalYearsDecimalsFactor);
        this.totalYearsElm.innerText =
            this.padDecimals(totalYears, this.totalYearsDecimals);
        if (this.totalMillenniaEasterEggEnabled) {
            this.totalMillenniaEasterEgg.innerHTML =
                this.padDecimals(totalYears / 1000, this.totalYearsDecimals);
        }
        this.requestAnimationFrameHandle = requestAnimationFrame(function () { return _this.requestAnimationFrameCallback(); });
    };
    _CountdownView.prototype.updateElms = function (diff) {
        var i = 0;
        for (; i < dateDiffNumbersKeys.length - 1; i++) {
            var key = dateDiffNumbersKeys[i];
            if (diff[key] !== 0) {
                break;
            }
            this.elms[key].innerText = "0";
            this.elms[key].classList.add("leadingZero");
            this.elms[key].classList.remove("first");
        }
        this.firstNonZeroedIndex = i;
        for (; i < dateDiffNumbersKeys.length; i++) {
            var key = dateDiffNumbersKeys[i];
            this.elms[key].innerText = this.padStart0(diff[key].toString(), this.dateDiffNumberDigits[key]);
            if (diff[key] === 1) {
                this.elms[key].classList.add("singular");
            }
            else {
                this.elms[key].classList.remove("singular");
            }
            this.elms[key].classList.remove("leadingZero");
            this.elms[key].classList.remove("first");
        }
        this.elms.negative.innerText = diff.negative ? "ago" : "";
        var firstNonZeroed = dateDiffNumbersKeys[this.firstNonZeroedIndex];
        this.elms[firstNonZeroed].classList.add("first");
    };
    _CountdownView.prototype.padStart0 = function (str, length) {
        if (!length) {
            return str;
        }
        var padLength = length - str.length;
        if (padLength <= 0) {
            return str;
        }
        var s = "";
        for (var i = 0; i < padLength; i++) {
            s += "0";
        }
        return s + str;
    };
    _CountdownView.prototype.padDecimals = function (n, numDecimalDigits) {
        var decimalsStr = Math.round(Math.abs(n % 1) * (Math.pow(10, numDecimalDigits))).toString();
        var padded = this.padStart0(decimalsStr, numDecimalDigits);
        var trunked = (n | 0);
        return (trunked === 0 && n < 0 ? "-0" : trunked).toString() + "." + padded;
    };
    _CountdownView.prototype.roundWithFactor = function (n, to) {
        return Math.round(n / to) / (1 / to);
    };
    return _CountdownView;
}(View));
var countdownView = new _CountdownView();
export default countdownView;
