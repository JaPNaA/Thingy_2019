import Canvas from "./Canvas";
import Camera from "./Camera";
import CircleCollider from "./CircleCollider";
import IEntity from "./interfaces/IEntity";

class Renderer {
    private canvas: Canvas;
    private camera: Camera;
    private X: CanvasRenderingContext2D;

    constructor(canvas: Canvas, camera: Camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.X = canvas.getX();
    }

    public renderAll(renderables: IEntity[]): void {
        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.apply(this.X);
        for (const renderable of renderables) {
            this.X.save();
            renderable.render(this.X);
            this.X.restore();
        }
        this.X.resetTransform();
    }

    public debugRenderQuadtree(collider: CircleCollider): void {
        this.camera.apply(this.X);
        collider.quadTree.debugRender(this.X);
        this.X.resetTransform();
    }
}

export default Renderer;