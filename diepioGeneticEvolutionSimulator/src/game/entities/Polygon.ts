import Entity from "../Entity";
import Ticker from "../engine/Ticker";
import circleCircleElasticCollision from "../collisions/polygon-polygon";

abstract class Polygon extends Entity {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public vrotation: number;
    public rotation: number;

    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;

        this.vrotation = (Math.random() - 0.5) * 0.025;
        this.rotation = Math.random() * Math.PI * 2;
    }

    public tick(): void { }
    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;

        this.vx *= Polygon.fixedFriction;
        this.vy *= Polygon.fixedFriction;

        this.rotation += this.vrotation;
    }

    public collideWith(other: Entity): void {
        circleCircleElasticCollision(this, other);
    }
}

export default Polygon;