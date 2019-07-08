import { mouse } from "./ui/Mouse";

class Camera {
    private x: number;
    private y: number;
    private scale: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;

        this.setup();
    }

    public apply(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.scale(this.scale, this.scale);
    }

    public setup(): void {
        addEventListener("mousemove", e => {
            if (!mouse.down) { return; }
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
}

export default Camera;