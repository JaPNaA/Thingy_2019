import TouchControls from "./TouchControls";

class Canvas {
    public width: number;
    public height: number;
    public touchControls: TouchControls;
    private canvas: HTMLCanvasElement;
    private X: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.X = this.canvas.getContext("2d")!;

        this.canvas.width = this.width = 1280;
        this.canvas.height = this.height = 720;
        this.touchControls = new TouchControls(this.canvas);

        this.setup();
    }

    public getX(): CanvasRenderingContext2D {
        return this.X;
    }

    public appendTo(parent: Element): void {
        parent.appendChild(this.canvas);
    }

    private setup(): void {
        this.touchControls.setup();
        addEventListener("resize", this.resizeHandler.bind(this));
        this.resizeHandler();
    }

    private resizeHandler(): void {
        this.width = this.canvas.width = innerWidth;
        this.height = this.canvas.height = innerHeight;
    }
}

export default Canvas;