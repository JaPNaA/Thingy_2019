import Canvas from "./Canvas";
import Camera from "./Camera";
import IEntity from "./interfaces/IEntity";
import CircleQuadTree from "./CircleQuadTree";

class Renderer {
    public debugDrawHitCircle: boolean;

    private canvas: Canvas;
    private camera: Camera;
    private X: CanvasRenderingContext2D;

    constructor(canvas: Canvas, camera: Camera) {
        this.debugDrawHitCircle = false;

        this.canvas = canvas;
        this.camera = camera;
        this.X = canvas.getX();
    }

    public renderEntitiesInTree(tree: CircleQuadTree<IEntity>) {
        const now = performance.now();
        const viewWidth = this.canvas.width / this.camera.scale;
        const viewHeight = this.canvas.height / this.camera.scale;
        const viewX = -this.camera.x / this.camera.scale;
        const viewY = -this.camera.y / this.camera.scale;

        const entities = tree.rectQueryNoVerify(viewX, viewY, viewWidth, viewHeight);

        this.X.fillStyle = "#c9c9c9";
        this.X.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera.apply(this.X);
        this.X.fillStyle = "#00000008";

        this.drawGrid(viewX, viewY, viewWidth, viewHeight);

        if (this.debugDrawHitCircle) {
            for (const entity of entities) {
                this.X.save();
                entity.render(this.X, now);
                this.X.restore();
                entity.__debugRenderHitCircle(this.X);
            }
        } else {
            for (const entity of entities) {
                this.X.save();
                entity.render(this.X, now);
                this.X.restore();
            }
        }

        this.X.resetTransform();
    }

    public debugRenderQuadtree(tree: CircleQuadTree<IEntity>): void {
        this.camera.apply(this.X);
        tree.debugRender(this.X);
        this.X.resetTransform();
    }

    private drawGrid(viewX: number, viewY: number, viewWidth: number, viewHeight: number): void {
        if (this.camera.scale < 0.1) { return; }

        const viewRightX = viewX + viewWidth;
        const viewBottomY = viewY + viewHeight;
        const step = 25;

        this.X.strokeStyle = "#000000";
        this.X.globalAlpha = 0.1;
        this.X.lineWidth = 0.5;

        this.X.beginPath();

        for (let x = Math.floor(viewX / step) * step; x < viewRightX; x += step) {
            this.X.moveTo(x, viewY);
            this.X.lineTo(x, viewBottomY);
        }

        for (let y = Math.floor(viewY / step) * step; y < viewBottomY; y += step) {
            this.X.moveTo(viewX, y);
            this.X.lineTo(viewRightX, y);
        }

        this.X.stroke();
        this.X.globalAlpha = 1;
    }
}

export default Renderer;