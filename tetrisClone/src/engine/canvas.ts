class Canvas {
    private canvas: HTMLCanvasElement;
    private renderingContext: CanvasRenderingContext2D;

    private width: number;
    private height: number;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.width = 300;
        this.height = 150;

        const X = this.canvas.getContext("2d");
        if (!X) { throw new Error("Canvas not supported"); }
        this.renderingContext = X;
    }

    public resize(width: number, height: number) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
    }

    public appendTo(parent: Element) {
        parent.appendChild(this.canvas);
    }

    public getX(): CanvasRenderingContext2D {
        return this.renderingContext;
    }
}

export default Canvas;