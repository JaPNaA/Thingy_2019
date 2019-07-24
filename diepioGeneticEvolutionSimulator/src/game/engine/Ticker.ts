import IEntity from "./interfaces/IEntity";

class Ticker<T extends IEntity> {
    public static fixedTime: number = 1000 / 120;

    private leftOverFixed: number;
    private then: number;

    constructor() {
        this.then = performance.now();
        this.leftOverFixed = 0;
    }

    public resume(): void {
        this.then = performance.now();
    }

    public tickAll(entities: T[]): void {
        const now = performance.now();
        const deltaTime = now - this.then;
        this.then = now;

        for (const entity of entities) {
            entity.tick(deltaTime);
        }

        for (this.leftOverFixed += deltaTime; this.leftOverFixed >= Ticker.fixedTime; this.leftOverFixed -= Ticker.fixedTime) {
            for (const entity of entities) {
                if (entity._sleeping) { continue; }
                entity.fixedTick();
            }
        }
    }
}

export default Ticker;