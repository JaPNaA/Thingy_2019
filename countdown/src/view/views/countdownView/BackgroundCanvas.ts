export default class BackgroundCanvas {
    private context: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.context = this.getContext();

        this.context.fillRect(0, 0, 50, 50);
    }

    private getContext(): CanvasRenderingContext2D {
        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("canvas not suported"); }
        return X;
    }
}