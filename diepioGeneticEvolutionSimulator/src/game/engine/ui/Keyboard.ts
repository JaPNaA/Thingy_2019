import { Key, key } from "./Key";

class Keyboard {
    public map: boolean[];

    constructor() {
        this.map = [];
        this.fillMap();
        this.addEventHandlers();
    }

    public isDown(keyName: keyof Key): boolean {
        return this.map[key[keyName]];
    }

    private fillMap(): void {
        for (let i = 0; i < 256; i++) {
            this.map[i] = false;
        }
    }

    private addEventHandlers(): void {
        addEventListener("keydown", this.keydownHandler.bind(this));
        addEventListener("keyup", this.keyupHandler.bind(this));
        addEventListener("blur", this.blurHandler.bind(this));
    }

    private keydownHandler(e: KeyboardEvent): void {
        this.map[e.keyCode] = true;
    }

    private keyupHandler(e: KeyboardEvent): void {
        this.map[e.keyCode] = false;
    }

    private blurHandler(): void {
        for (let i = 0; i < this.map.length; i++) {
            this.map[i] = false;
        }
    }
}

const keyboard = new Keyboard()

export { Keyboard, keyboard };