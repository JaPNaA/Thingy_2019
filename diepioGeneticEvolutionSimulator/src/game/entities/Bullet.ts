import Entity from "../Entity";
import circleCircleElasticCollision from "../collisions/polygon-polygon";
import Game from "../Game";
import Ticker from "../engine/Ticker";

class Bullet extends Entity {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public radius: number;
    public rotation: number;
    public health: number;

    private static fixedFriction = 0.99995 ** Ticker.fixedTime;

    constructor(game: Game, x: number, y: number, speed: number, direction: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.radius = 6;
        this.rotation = 0;
        this.health = 1;
    }

    public render(X: CanvasRenderingContext2D): void {
        X.beginPath();
        X.fillStyle = "#ff5762";
        X.strokeStyle = "#888888";
        X.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        X.fill();
        X.stroke();
    }

    public tick(deltaTime: number): void { }

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;

        this.vx *= Bullet.fixedFriction;
        this.vy *= Bullet.fixedFriction;
    }

    public collideWith(other: Entity): void {
        circleCircleElasticCollision(this, other);
    }
}

export default Bullet;