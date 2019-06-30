class Mouse {
    public x: number;
    public y: number;
    public down: boolean;

    constructor() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.down = false;

        this.setup()
    }

    private setup(): void {
        addEventListener("mousemove", this.mousemoveHandler.bind(this));
        addEventListener("mousedown", this.mousedownHandler.bind(this));
        addEventListener("mouseup", this.mouseupHandler.bind(this));
    }

    private mousemoveHandler(e: MouseEvent): void {
        this.x = e.clientX;
        this.y = e.clientY;
    }

    private mousedownHandler(e: MouseEvent): void {
        this.x = e.clientX;
        this.y = e.clientY;
        this.down = true;
    }

    private mouseupHandler(e: MouseEvent): void {
        this.x = e.clientX;
        this.y = e.clientY;
        this.down = false;
    }
}

const mouse = new Mouse();

export { Mouse, mouse };