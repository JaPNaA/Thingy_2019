import { keyboard } from "./ui/Keyboard";
import { mouse } from "./ui/Mouse";
import IEntity from "./interfaces/IEntity";
import Canvas from "./Canvas";

class Camera {
    public x: number;
    public y: number;
    public scale: number;
    private attached: boolean;

    private tScale: number;
    private tx: number;
    private ty: number;

    private attachedFromX: number;
    private attachedFromY: number;

    private cursorLocked: boolean;

    private attachee?: IEntity;
    private canvas: Canvas;

    private updateLocationHandlers: Function[];

    constructor(canvas: Canvas) {
        this.tx = this.x = 0;
        this.ty = this.y = 0;
        this.tScale = this.scale = 1;
        this.attached = false;
        this.canvas = canvas;

        this.attachedFromX = 0;
        this.attachedFromY = 0;

        this.cursorLocked = false;

        this.updateLocationHandlers = [];

        this.setup();
    }

    public apply(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.scale(this.scale, this.scale);
    }

    public applyTranslateOnly(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
    }

    public goto(x: number, y: number, scale?: number): void {
        if (scale) {
            this.tScale = scale;
        }
        this.tx = -x * this.tScale + this.canvas.width / 2;
        this.ty = -y * this.tScale + this.canvas.height / 2;
    }

    public gotoNoTransition(x: number, y: number, scale?: number): void {
        if (scale) {
            this.scale = this.tScale = scale;
        }
        this.x = this.tx = -x * this.tScale + this.canvas.width / 2;
        this.y = this.ty = -y * this.tScale + this.canvas.height / 2;
    }

    public attachTo(entity?: IEntity): void {
        if (entity) {
            this.attachedFromX = this.x;
            this.attachedFromY = this.y;
            this.attached = true;
        } else {
            if (this.attachee) {
                const ang = Math.atan2(
                    this.y - this.attachedFromY,
                    this.x - this.attachedFromX
                );
                this.tx -= Math.cos(ang) * 100;
                this.ty -= Math.sin(ang) * 100;
            }
            this.attached = false;
        }
        this.attachee = entity;
    }

    public setup(): void {
        addEventListener("mousemove", e => {
            if (this.attached) { return; }
            if (keyboard.isDown("space") || mouse.down) {
                this.x += e.movementX;
                this.y += e.movementY;
                this.tx += e.movementX;
                this.ty += e.movementY;
            }
        });

        addEventListener("mouseout", () => {
            if (keyboard.isDown("space")) {
                document.body.requestPointerLock();
                this.cursorLocked = true;
            }
        });

        addEventListener("keyup", () => {
            if (!keyboard.isDown("space") && this.cursorLocked) {
                document.exitPointerLock();
                this.cursorLocked = false;
            }
        });

        addEventListener("wheel", e => {
            let factor = 1.2;

            if (e.deltaY > 0) {
                factor = 1 / factor;
            }

            if (this.attached) {
                this.goto(this.attachee!.x, this.attachee!.y);
            } else {
                let x = e.clientX;
                let y = e.clientY;

                if (this.cursorLocked) {
                    x = innerWidth / 2;
                    y = innerHeight / 2;
                }

                const dx = -(x - this.tx) * (factor - 1);
                const dy = -(y - this.ty) * (factor - 1);
                this.tx += dx;
                this.ty += dy;
            }

            this.tScale *= factor;
        });
    }

    public onUpdateLocation(handler: Function): void {
        this.updateLocationHandlers.push(handler);
    }

    public updateLocation(): void {
        this.updateTarget();
        this.ease();
    }

    private updateTarget(): void {
        if (!this.attachee) { return; }
        if (this.attachee.destoryed) {
            this.attachTo(undefined);
            return;
        }

        this.goto(this.attachee.x, this.attachee.y);

        for (const handler of this.updateLocationHandlers) {
            handler();
        }
    }

    private ease(): void {
        this.scale += (this.tScale - this.scale) / 6;
        this.x += (this.tx - this.x) / 6;
        this.y += (this.ty - this.y) / 6;
    }
}

export default Camera;