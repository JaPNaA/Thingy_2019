import Entity from "../Entity";
import Ticker from "../engine/Ticker";
import circleCircleElasticCollision from "../collisions/polygon-polygon";
import Game from "../Game";
import { isXPGivable } from "./IXPGivable";

abstract class Polygon extends Entity {
    public abstract xpValue: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public vrotation: number;
    public rotation: number;
    public damage: number = 1;
    public teamID = Polygon.polygonTeam;
    public targetable = true;

    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;
    private static polygonTeam: number = -1;

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5);
        this.vy = (Math.random() - 0.5);

        this.vrotation = (Math.random() - 0.5) * 0.0015;
        this.rotation = Math.random() * Math.PI * 2;
    }

    public tick(deltaTime: number): void {
        this.rotation += this.vrotation * deltaTime;
    }

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;

        this.vx *= Polygon.fixedFriction;
        this.vy *= Polygon.fixedFriction;
    }

    public collideWith(other: Entity): void {
        super.collideWith(other);
        circleCircleElasticCollision(this, other);
    }

    public destory(by: Entity): void {
        super.destory(by);

        if (isXPGivable(by)) {
            by.giveXP(this.xpValue);
        }
    }
}

export default Polygon;