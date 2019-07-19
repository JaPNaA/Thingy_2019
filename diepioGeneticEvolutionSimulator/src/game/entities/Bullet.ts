import Entity from "../Entity";
import circleCircleElasticCollision from "../collisions/polygon-polygon";
import Game from "../Game";
import Ticker from "../engine/Ticker";
import Tank from "./tank/Tank";
import { IXPGivable } from "./IXPGivable";

class Bullet extends Entity implements IXPGivable {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public rotation: number;
    public radius: number;
    public health: number;
    public damage: number;
    public ttl: number = 10000;
    public targetable = false;

    public firer?: Tank;

    private hue: number;

    private static fixedFriction = 0.99995 ** Ticker.fixedTime;

    constructor(game: Game, x: number, y: number, speed: number, direction: number, health: number, damage: number, radius: number, hue: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.rotation = 0;
        this.health = health;
        this.damage = damage;
        this.radius = radius;
        this.hue = hue;
    }

    public render(X: CanvasRenderingContext2D): void {
        X.beginPath();
        X.lineWidth = 3;
        X.strokeStyle = "hsl(" + this.hue + ",79%,35%)";
        X.fillStyle = "hsl(" + this.hue + ",78%,49%)";
        X.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        X.fill();
        X.stroke();
    }

    public tick(deltaTime: number): void {
        this.ttl -= deltaTime;
        if (this.ttl < 0) {
            this.destory();
        }
    }

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;

        this.vx *= Bullet.fixedFriction;
        this.vy *= Bullet.fixedFriction;
    }

    public collideWith(other: Entity): void {
        super.collideWith(other);
        circleCircleElasticCollision(this, other);
    }

    public setFirer(firer: Tank): void {
        this.teamID = firer.teamID;
        this.firer = firer;
    }

    public giveXP(xp: number): void {
        if (this.firer) {
            this.firer.giveXP(xp);
        }
    }
}

export default Bullet;