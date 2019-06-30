import Entity from "../Entity";
import { keyboard } from "../engine/ui/Keyboard";
import Ticker from "../engine/Ticker";
import circleCircleElasticCollision from "../collisions/polygon-polygon";

class Player extends Entity {
    public radius: number = 24;
    public health: number = 4;
    public rotation: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;

    private static speed = 0.0005;
    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;

    private canonWidth: number = 18;
    private canonLength: number = 20;

    private ax: number;
    private ay: number;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.rotation = 0;
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
        let ax = 0;
        let ay = 0;

        if (keyboard.isDown('w')) {
            ay -= 1;
        }
        if (keyboard.isDown('s')) {
            ay += 1;
        }
        if (keyboard.isDown('a')) {
            ax -= 1;
        }
        if (keyboard.isDown('d')) {
            ax += 1;
        }

        this.ax = ax;
        this.ay = ay;
    }

    public fixedTick(): void {
        this.vx *= Player.fixedFriction;
        this.vy *= Player.fixedFriction;
        this.vx += this.ax * Ticker.fixedTime * Player.speed;
        this.vy += this.ay * Ticker.fixedTime * Player.speed;
        super.fixedTick();
    }

    public collideWith(other: Entity): void {
        circleCircleElasticCollision(this, other);
    }
}

export default Player;