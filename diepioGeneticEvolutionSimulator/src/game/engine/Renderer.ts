import IRenderable from "./interfaces/IRenderable";
import Canvas from "./Canvas";

class Renderer {
    private canvas: Canvas;
    private X: CanvasRenderingContext2D;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.X = canvas.getX();
    }

    renderAll(renderables: IRenderable[]): void {
        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const renderable of renderables) {
            this.X.save();
            renderable.render(this.X);
            this.X.restore();
        }
    }
}

export default Renderer;