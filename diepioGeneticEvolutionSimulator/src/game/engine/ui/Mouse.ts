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
        addEventListener("touchstart", this.touchstartHandler.bind(this));
        addEventListener("touchend", this.touchendHandler.bind(this));
        addEventListener("touchmove", this.touchmoveHandler.bind(this));
    }

    private mousemoveHandler(e: MouseEvent): void {
        this.updateCameraPos({ x: e.clientX, y: e.clientY });
    }

    private mousedownHandler(e: MouseEvent): void {
        if (e.button !== 0) { return; }
        this.updateCameraPos({ x: e.clientX, y: e.clientY });
        this.down = true;
    }

    private mouseupHandler(e: MouseEvent): void {
        this.updateCameraPos({ x: e.clientX, y: e.clientY });
        this.down = false;
    }

    private touchstartHandler(e: TouchEvent): void {
        this.updateCameraPos({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY })
        this.down = true;
    }

    private touchendHandler(e: TouchEvent): void {
        this.updateCameraPos({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
        this.down = false;
    }

    private touchmoveHandler(e: TouchEvent): void {
        this.updateCameraPos({ x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY });
    }

    private updateCameraPos(e?: { x: number, y: number }): void {
        if (this.camera) {
            if (e) {
                this.x = (e.x - this.camera.x) / this.camera.scale;
                this.y = (e.y - this.camera.y) / this.camera.scale;
                this.clientX = e.x;
                this.clientY = e.y;
            } else {
                this.x = (this.clientX - this.camera.x) / this.camera.scale;
                this.y = (this.clientY - this.camera.y) / this.camera.scale;
            }
        } else if (e) {
            this.x = e.y;
            this.y = e.x;
        }
    }
}

const mouse = new Mouse();

export { Mouse, mouse };