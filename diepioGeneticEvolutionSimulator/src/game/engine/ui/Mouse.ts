import Camera from "../Camera";

class Mouse {
    public x: number;
    public y: number;
    public down: boolean;
    private camera?: Camera;

    private clientX: number;
    private clientY: number;

    constructor() {
        this.clientX = this.x = innerWidth / 2;
        this.clientY = this.y = innerHeight / 2;
        this.down = false;

        this.setup()
    }

    public attachCamera(camera: Camera) {
        this.camera = camera;
        this.camera.onUpdateLocation(this.updateCameraPos.bind(this));
    }

    private setup(): void {
        addEventListener("mousemove", this.mousemoveHandler.bind(this));
        addEventListener("mousedown", this.mousedownHandler.bind(this));
        addEventListener("mouseup", this.mouseupHandler.bind(this));
    }

    private mousemoveHandler(e: MouseEvent): void {
        this.updateCameraPos(e);
    }

    private mousedownHandler(e: MouseEvent): void {
        this.updateCameraPos(e);
        this.down = true;
    }

    private mouseupHandler(e: MouseEvent): void {
        this.updateCameraPos(e);
        this.down = false;
    }

    private updateCameraPos(e?: MouseEvent): void {
        if (this.camera) {
            if (e) {
                this.x = (e.clientX - this.camera.x) / this.camera.scale;
                this.y = (e.clientY - this.camera.y) / this.camera.scale;
                this.clientX = e.clientX;
                this.clientY = e.clientY;
            } else {
                this.x = (this.clientX - this.camera.x) / this.camera.scale;
                this.y = (this.clientY - this.camera.y) / this.camera.scale;
            }
        } else if (e) {
            this.x = e.clientX;
            this.y = e.clientY;
        }
    }
}

const mouse = new Mouse();

export { Mouse, mouse };