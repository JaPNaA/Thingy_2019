import IEntity from "./interfaces/IEntity";

class Ticker<T extends IEntity> {
    public static fixedTime: number = 1000 / 120;

    private leftOverFixed: number;
    private then: number;

    constructor() {
        this.then = performance.now();
        this.leftOverFixed = 0;
    }

    tickAll(entities: T[]): void {
        const now = performance.now();
        const deltaTime = now - this.then;
        this.then = now;

        for (const entity of entities) {
            entity.tick(deltaTime);
        }

        for (this.leftOverFixed += deltaTime; this.leftOverFixed >= Ticker.fixedTime; this.leftOverFixed -= Ticker.fixedTime) {
            for (const tickable of entities) {
                tickable.fixedTick();
            }
        }
    }
}

export default Ticker;