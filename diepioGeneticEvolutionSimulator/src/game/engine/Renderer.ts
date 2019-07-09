import Canvas from "./Canvas";
import Camera from "./Camera";
import IEntity from "./interfaces/IEntity";
import CircleQuadTree from "./CircleQuadTree";

class Renderer {
    private canvas: Canvas;
    private camera: Camera;
    private X: CanvasRenderingContext2D;

    constructor(canvas: Canvas, camera: Camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.X = canvas.getX();
    }

    public renderAll(entities: IEntity[]): void {
        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera.apply(this.X);
        for (const entity of entities) {
            this.X.save();
            entity.render(this.X);
            this.X.restore();
        }
        this.X.resetTransform();
    }

    public renderEntitiesInTree(tree: CircleQuadTree<IEntity>) {
        const entities = tree.rectQueryNoVerify(
            -this.camera.x / this.camera.scale,
            -this.camera.y / this.camera.scale,
            this.canvas.width / this.camera.scale,
            this.canvas.height / this.camera.scale
        );

        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera.apply(this.X);
        this.X.fillStyle = "#00000008";

        for (const entity of entities) {
            this.X.save();
            entity.render(this.X);
            this.X.restore();
        }
        this.X.resetTransform();
    }

    public debugRenderQuadtree(tree: CircleQuadTree<IEntity>): void {
        this.camera.apply(this.X);
        tree.debugRender(this.X);
        this.X.resetTransform();
    }
}

export default Renderer;