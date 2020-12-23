import View from "../view.js";
import { addKonamiCodeListener, getElmById, registerResizeHandler, toggleClass } from "../../utils.js";
import { DateDiff, dateDiffNumbersKeys, dateDiff, getTotalYearDiff } from "../../date.js";
import views from "../views.js";
import startView from "./startView.js";
import BackgroundCanvas from "./countdownView/BackgroundCanvas.js";

class _CountdownView extends View {
    public targetDate: Date = new Date();


    private backgroundCanvas = new BackgroundCanvas(
        getElmById("backgroundCanvas") as HTMLCanvasElement
    );

    private totalmillisecondsElm = getElmById("countdownTotalMilliseconds");
    private totalYearsElm = getElmById("countdownTotalYears");
    private totalMillenniaEasterEgg = getElmById("countdownTotalMillenniaEasterEgg");
    private totalMillenniaEasterEggEnabled = false;

    private actionReset = getElmById("timerActionReset");
    private actionDark = getElmById("timerActionDark");
    private actionBackground = getElmById("timerActionBackground");
    private actionFullscreen = getElmById("timerActionFullscreen");
    private actionFooter = getElmById("timerActionFooter");

    private elms: { [x in keyof DateDiff]: HTMLElement } = {
        years: getElmById("countdownYears"),
        months: getElmById("countdownMonths"),
        days: getElmById("countdownDays"),
        hours: getElmById("countdownHours"),
        minutes: getElmById("countdownMinutes"),
        seconds: getElmById("countdownSeconds"),
        milliseconds: getElmById("countdownMilliseconds"),
        negative: getElmById("countdownNegative")
    };

    private dateDiffNumberDigits: { [x in keyof DateDiff]?: number } = {
        seconds: 2,
        milliseconds: 3
    };
    private totalYearsDecimals = 9;
    private totalYearsDecimalsFactor = Math.pow(10, -this.totalYearsDecimals);

    private firstNonZeroedIndex = 0;

    private requestAnimationFrameHandle: number = -1;
    private actionTimeoutHandle: number = -1;

    private isDark: boolean = false;
    private isBackgroundEnabled: boolean = true;

    constructor() {
        super(getElmById("countdown"));
        addKonamiCodeListener(() => {
            this.totalMillenniaEasterEggEnabled = true;
            this.totalMillenniaEasterEgg.classList.remove("hidden");
        });

        this.setup();
    }

    public open() {
        super.open();
        this.requestAnimationFrameCallback();
        this.resizeHandler();

        location.hash = this.targetDate.getTime().toString();

        addEventListener("mousemove", this.actionHandler);
        addEventListener("mousedown", this.actionHandler);
        addEventListener("touchstart", this.actionHandler);
        addEventListener("touchmove", this.actionHandler);
        this.actionHandler();
    }

    public close() {
        super.close();
        cancelAnimationFrame(this.requestAnimationFrameHandle);
        clearTimeout(this.actionTimeoutHandle);

        removeEventListener("mousemove", this.actionHandler);
        removeEventListener("mousedown", this.actionHandler);
        removeEventListener("touchstart", this.actionHandler);
        removeEventListener("touchmove", this.actionHandler);
    }

    private setup() {
        this.actionHandler = this.actionHandler.bind(this);

        registerResizeHandler(() => this.resizeHandler());

        if (!document.fullscreenEnabled) {
            this.actionFullscreen.classList.add("disabled");
        }

        this.actionReset.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            location.hash = "";
            views.switch(startView);
        });

        this.actionDark.addEventListener("click", () => {
            if (this.isDark) {
                document.body.classList.remove("dark");
                this.backgroundCanvas.setColor("#000000");
            } else {
                document.body.classList.add("dark");
                this.backgroundCanvas.setColor("#ffffff");
            }

            this.isDark = !this.isDark;
        });

        this.actionBackground.addEventListener("click", () => {
            if (this.isBackgroundEnabled) {
                this.elm.classList.add("backgroundDisabled");
            } else {
                this.elm.classList.remove("backgroundDisabled");
            }

            this.isBackgroundEnabled = !this.isBackgroundEnabled;
        })

        this.actionFullscreen.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                this.elm.requestFullscreen();
            }
        });

        this.actionFooter.addEventListener("click", () => {
            toggleClass(this.elm, "footerHidden");
        });
    }

    private actionHandler(): void {
        this.elm.classList.remove("settled");

        clearTimeout(this.actionTimeoutHandle);

        this.actionTimeoutHandle = setTimeout(() => {
            this.elm.classList.add("settled");
        }, 4000);
    }

    private resizeHandler(): void {
        this.backgroundCanvas.resizeHandler();
        this.elm.style.fontSize = Math.max(
            26,
            Math.min(innerWidth * 0.08, innerHeight * 0.1)
        ) + "px";
    }

    private requestAnimationFrameCallback(): void {
        const now = new Date();

        const diff = dateDiff(this.targetDate, now);
        const msDiff = this.targetDate.getTime() - now.getTime();

        if (diff.negative) {
            this.elm.classList.add("negative");
        } else {
            this.elm.classList.remove("negative");
        }

        this.updateElms(diff);
        this.elm.setAttribute("firstnonzero", dateDiffNumbersKeys[this.firstNonZeroedIndex]);

        if (this.isBackgroundEnabled) {
            this.backgroundCanvas.draw(diff);
        }

        this.totalmillisecondsElm.innerText = msDiff.toString();

        const totalYears = this.roundWithFactor(
            getTotalYearDiff(now, this.targetDate),
            this.totalYearsDecimalsFactor
        );

        this.totalYearsElm.innerText =
            this.padDecimals(totalYears, this.totalYearsDecimals);

        if (this.totalMillenniaEasterEggEnabled) {
            this.totalMillenniaEasterEgg.innerHTML =
                this.padDecimals(totalYears / 1000, this.totalYearsDecimals);
        }

        this.requestAnimationFrameHandle = requestAnimationFrame(() => this.requestAnimationFrameCallback());
    }

    private updateElms(diff: DateDiff): void {
        let i = 0;
        for (; i < dateDiffNumbersKeys.length - 1; i++) {
            const key = dateDiffNumbersKeys[i];
            if (diff[key] !== 0) { break; }
            this.elms[key].innerText = "0";
            this.elms[key].classList.add("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.firstNonZeroedIndex = i;

        for (; i < dateDiffNumbersKeys.length; i++) {
            const key = dateDiffNumbersKeys[i];
            this.elms[key].innerText = this.padStart0(diff[key].toString(), this.dateDiffNumberDigits[key]);
            if (diff[key] === 1) {
                this.elms[key].classList.add("singular");
            } else {
                this.elms[key].classList.remove("singular");
            }
            this.elms[key].classList.remove("leadingZero");
            this.elms[key].classList.remove("first");
        }

        this.elms.negative.innerText = diff.negative ? "ago" : "";

        const firstNonZeroed = dateDiffNumbersKeys[this.firstNonZeroedIndex];
        this.elms[firstNonZeroed].classList.add("first");
    }

    private padStart0(str: string, length?: number): string {
        if (!length) { return str; }
        const padLength = length - str.length;
        if (padLength <= 0) { return str; }
        let s = "";
        for (let i = 0; i < padLength; i++) {
            s += "0";
        }
        return s + str;
    }

    private padDecimals(n: number, numDecimalDigits: number): string {
        const decimalsStr = Math.round(Math.abs(n % 1) * (10 ** numDecimalDigits)).toString();
        const padded = this.padStart0(decimalsStr, numDecimalDigits);
        const trunked = (n | 0);
        return (trunked === 0 && n < 0 ? "-0" : trunked).toString() + "." + padded;
    }

    private roundWithFactor(n: number, to: number): number {
        return Math.round(n / to) / (1 / to);
    }
}

const countdownView = new _CountdownView();
export default countdownView;