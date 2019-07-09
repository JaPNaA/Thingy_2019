import CircleCollider from "./CircleCollider";
import IEntity from "./interfaces/IEntity";

class Ticker {
    public static fixedTime: number = 1000 / 120;

    private collider: CircleCollider;
    private leftOverFixed: number;
    private then: number;

    constructor(collider: CircleCollider) {
        this.then = performance.now();
        this.leftOverFixed = 0;
        this.collider = collider;
    }

    tickAll(entities: IEntity[]): void {
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