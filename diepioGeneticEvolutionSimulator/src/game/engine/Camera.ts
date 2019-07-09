import { keyboard } from "./ui/Keyboard";
import { mouse } from "./ui/Mouse";
import IEntity from "./interfaces/IEntity";
import Canvas from "./Canvas";

class Camera {
    public x: number;
    public y: number;
    public scale: number;
    private attached: boolean;

    private attachee?: IEntity;
    private canvas: Canvas;

    private updateLocationHandlers: Function[];

    constructor(canvas: Canvas) {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.attached = false;
        this.canvas = canvas;

        this.updateLocationHandlers = [];

        this.setup();
    }

    public apply(X: CanvasRenderingContext2D): void {
        this.updateLocation();
        X.translate(this.x, this.y);
        X.scale(this.scale, this.scale);
    }

    public attachTo(entity: IEntity): void {
        this.attachee = entity;
        this.attached = true;
    }

    public setup(): void {
        addEventListener("mousemove", e => {
            if (!(keyboard.isDown("space") || mouse.down) || this.attached) { return; }
            this.x += e.movementX;
            this.y += e.movementY;
        });

        addEventListener("wheel", e => {
            let factor = 1.2;

            if (e.deltaY > 0) {
                factor = 1 / factor;
            }

            this.x -= (e.clientX - this.x) * (factor - 1);
            this.y -= (e.clientY - this.y) * (factor - 1);
            this.scale *= factor;
        });
    }

    public onUpdateLocation(handler: Function): void {
        this.updateLocationHandlers.push(handler);
    }

    private updateLocation(): void {
        if (!this.attachee) { return; }
        this.x = -this.attachee.x * this.scale + this.canvas.width / 2;
        this.y = -this.attachee.y * this.scale + this.canvas.height / 2;

        for (const handler of this.updateLocationHandlers) {
            handler();
        }
    }
}

export default Camera;