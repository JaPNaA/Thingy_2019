import IRenderable from "./interfaces/IRenderable";
import Canvas from "./Canvas";
import Camera from "./Camera";

class Renderer {
    private canvas: Canvas;
    private camera: Camera;
    private X: CanvasRenderingContext2D;

    constructor(canvas: Canvas, camera: Camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.X = canvas.getX();
    }

    public renderAll(renderables: IRenderable[]): void {
        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.apply(this.X);
        for (const renderable of renderables) {
            this.X.save();
            renderable.render(this.X);
            this.X.restore();
        }
        this.X.resetTransform();
    }
}

export default Renderer;