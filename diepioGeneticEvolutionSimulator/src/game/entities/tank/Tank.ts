import Entity from "../../Entity";
import Ticker from "../../engine/Ticker";
import Game from "../../Game";
import circleCircleElasticCollision from "../../collisions/polygon-polygon";
import Bullet from "../Bullet";

abstract class Tank extends Entity {
    public radius: number = 24;
    public health: number = 4;
    public rotation: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;

    protected range: number = 720;

    private static speed = 0.0005;
    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;

    private canonWidth: number = 18;
    private canonLength: number = 20;
    private cooldownSpeed: number = 1000;

    private cooldown: number;

    private ax: number;
    private ay: number;

    constructor(game: Game, x: number, y: number) {
        super(game);
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.rotation = 0;
        this.cooldown = 0;
    }

    public render(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        X.rotate(this.rotation);
        X.fillStyle = "#cccccc";
        X.strokeStyle = "#888888";

        X.beginPath();
        X.rect(0, -this.canonWidth / 2, this.canonLength + this.radius, this.canonWidth);
        X.fill();
        X.stroke();

        X.fillStyle = "#2faef7";
        X.beginPath();
        X.arc(0, 0, this.radius, 0, Math.PI * 2);
        X.fill();
        X.stroke();
    }

    public tick(deltaTime: number): void {
        this.doMovement();
        this.rotateToCursor();
        this.fireIfShould(deltaTime);
    }

    public fixedTick(): void {
        this.vx *= Tank.fixedFriction;
        this.vy *= Tank.fixedFriction;
        this.vx += this.ax * Ticker.fixedTime * Tank.speed;
        this.vy += this.ay * Ticker.fixedTime * Tank.speed;
        super.fixedTick();
    }

    public collideWith(other: Entity): void {
        circleCircleElasticCollision(this, other);
    }

    protected abstract getMovement(): [number, number];
    protected abstract getDirection(): [number, number];
    protected abstract getTriggered(): boolean;

    private doMovement(): void {
        const [ax, ay] = this.normalize(this.getMovement(), 1);
        this.ax = ax;
        this.ay = ay;
    }

    private rotateToCursor(): void {
        const [dx, dy] = this.getDirection();
        this.rotation = Math.atan2(dy, dx);
    }

    private fireIfShould(deltaTime: number): void {
        this.cooldown -= deltaTime;

        if (this.getTriggered()) {
            while (this.cooldown <= 0) {
                this.cooldown += this.cooldownSpeed;
                this.fireBullet();
            }
        } else {
            if (this.cooldown < 0) {
                this.cooldown = 0;
            }
        }
    }

    private fireBullet(): void {
        this.game.addEntity(new Bullet(
            this.game,
            this.x + Math.cos(this.rotation) * this.radius,
            this.y + Math.sin(this.rotation) * this.radius,
            0.4,
            this.rotation
        ));
    }

    private normalize(vec: [number, number], scale: number = 1): [number, number] {
        if (vec[0] === 0 && vec[1] === 0) { return [0, 0]; }
        const ang = Math.atan2(vec[1], vec[0]);
        return [Math.cos(ang) * scale, Math.sin(ang) * scale];
    }
}

export default Tank;