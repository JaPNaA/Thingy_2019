import ITickable from "./interfaces/ITickable";

class Ticker {
    public static fixedTime: number = 1000 / 120;

    private leftOverFixed: number;
    private then: number;

    constructor() {
        this.then = performance.now();
        this.leftOverFixed = 0;
    }

    tickAll(tickables: ITickable[]): void {
        const now = performance.now();
        const deltaTime = now - this.then;
        this.then = now;

        for (const tickable of tickables) {
            tickable.tick(deltaTime);
        }

        for (this.leftOverFixed += deltaTime; this.leftOverFixed >= Ticker.fixedTime; this.leftOverFixed -= Ticker.fixedTime) {
            for (const tickable of tickables) {
                tickable.fixedTick();
            }
        }
    }
}

export default Ticker;