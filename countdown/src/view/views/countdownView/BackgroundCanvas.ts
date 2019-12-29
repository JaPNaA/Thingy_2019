import { DateDiff } from "../../../date.js";

export default class BackgroundCanvas {
    private context: CanvasRenderingContext2D;

    private width: number = 0;
    private height: number = 0;

    private unitMaxesMap: [keyof DateDiff, number][] = [
        ["months", 12],
        ["days", 31],
        ["hours", 24],
        ["minutes", 60],
        ["seconds", 60],
        ["milliseconds", 1000]
    ];

    private fillStyle: string;

    constructor(private canvas: HTMLCanvasElement) {
        this.context = this.getContext();
        this.fillStyle = "#000000";
    }

    public draw(dateDiff: DateDiff) {
        this.context.clearRect(0, 0, this.width, this.height);

        const halfWidth = this.width / 2;

        let remaining = 1;

        this.context.fillStyle = this.fillStyle;

        for (const [key, max] of this.unitMaxesMap) {
            const value = dateDiff[key] as number;
            if (!value) { continue; }

            const normalized = value / max;

            const x = remaining * (1 - normalized);
            const width = (remaining - x) / 2 * halfWidth;

            this.context.globalAlpha = 0.075 * (-((x - 1) ** 10) + 1);
            this.context.fillRect(
                x * halfWidth,
                0, width, this.height
            );

            this.context.fillRect(
                halfWidth * (2 - x) - width,
                0, width, this.height
            );

            remaining -= normalized * remaining;
        }
    }

    public resizeHandler(): void {
        this.width = innerWidth;
        this.height = innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    public setColor(color: string): void {
        this.fillStyle = color;
    }

    private getContext(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("canvas not suported"); }
        return X;
    }
}