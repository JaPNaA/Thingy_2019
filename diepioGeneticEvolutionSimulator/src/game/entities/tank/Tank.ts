import Entity from "../../Entity";
import Ticker from "../../engine/Ticker";
import Game from "../../Game";
import circleCircleElasticCollision from "../../collisions/polygon-polygon";
import Bullet from "../Bullet";
import TankBuild from "./TankBuild";
import TankLevels from "./TankLevels";
import { IXPGivable, isXPGivable } from "../IXPGivable";

abstract class Tank extends Entity implements IXPGivable {
    public static initalRadius = 24;
    public static quickHealDelay: number = 60_000;

    public static initalCooldownSpeed = 1000;
    public static baseSpeed = 0.00035;
    public static baseRegenRate: number = 0.0001;
    public static baseMaxHealth: number = 16;

    protected unstableness: number = 0.2;
    protected range: number = 720;
    protected scale: number;
    protected maxHealth: number;

    protected cooldownSpeed: number;
    protected speed: number;
    protected regenRate: number;

    public radius: number = Tank.initalRadius;
    public damage: number = 0.5;
    public health: number;
    public rotation: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public targetable = true;

    protected ax: number;
    protected ay: number;

    protected build: TankBuild;
    protected levels: TankLevels;

    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;
    private static hpBarLength: number = 42;
    private static hpBarWidth: number = 6;
    private static hpBarPadding: number = 8;

    private canonWidth: number = 0.75;
    private canonLength: number = 0.85;
    private cooldown: number;

    private timeToQuickHeal: number;

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

        this.scale = 1;
        this.timeToQuickHeal = Tank.quickHealDelay;

        this.speed = Tank.baseSpeed;
        this.cooldownSpeed = Tank.initalCooldownSpeed;
        this.regenRate = 0;
        this.maxHealth = Tank.baseMaxHealth;

        this.health = this.maxHealth;

        this.build = new TankBuild();
        this.levels = new TankLevels();

        this.levels.onLevelUp(this.onLevelUp.bind(this));
    }

    public render(X: CanvasRenderingContext2D): void {
        X.translate(this.x, this.y);
        this.drawHPBar(X);

        X.rotate(this.rotation);
        X.fillStyle = "#cccccc";
        X.strokeStyle = "#888888";

        const canonWidth = this.canonWidth * this.radius;
        const canonLength = this.canonLength * this.radius;
        X.beginPath();
        X.rect(0, -canonWidth / 2, canonLength + this.radius, canonWidth);
        X.fill();
        X.stroke();

        X.fillStyle = "#2faef7";
        X.beginPath();
        X.arc(0, 0, this.radius, 0, Math.PI * 2);
        X.fill();
        X.stroke();
    }

    public tick(deltaTime: number): void {
        this.doMovement(deltaTime);
        this.rotateToCursor();
        this.fireIfShould(deltaTime);
        this.heal(deltaTime);
    }

    public fixedTick(): void {
        this.vx *= Tank.fixedFriction;
        this.vy *= Tank.fixedFriction;
        this.vx += this.ax * Ticker.fixedTime * this.speed;
        this.vy += this.ay * Ticker.fixedTime * this.speed;
        super.fixedTick();
    }

    public collideWith(other: Entity): void {
        super.collideWith(other);
        circleCircleElasticCollision(this, other);
    }

    public giveXP(xp: number): void {
        if (this.destoryed) { return; }
        this.levels.addXP(xp);
    }

    public destory(by: Entity): void {
        super.destory(by);
        if (isXPGivable(by)) {
            by.giveXP(this.levels.totalXP / 3);
        }
    }

    protected abstract getMovement(deltaTime: number): [number, number];
    protected abstract getDirection(): [number, number];
    protected abstract getTriggered(): boolean;

    protected onLevelUp(): void {
        this.scale = 1.01 ** (this.levels.level - 1);
        this.radius = this.scale * Tank.initalRadius;
    }

    protected reactHit(by: Entity): void {
        super.reactHit(by);
        this.timeToQuickHeal = Tank.quickHealDelay;
    }

    protected updateStatsWithBuild(): void {
        this.speed = Tank.baseSpeed * (1 + this.build.movementSpeed * 0.2);
        this.cooldownSpeed = Tank.initalCooldownSpeed * (1 - this.build.reload * 0.08);
        this.regenRate = Tank.baseRegenRate * (this.build.healthRegeneration ** 1.4);

        const healthRatio = this.health / this.maxHealth;
        this.maxHealth = Tank.baseMaxHealth * (1 + (this.build.maxHealth ** 1.4) * 0.1);
        this.health = this.maxHealth * healthRatio;
    }

    private drawHPBar(X: CanvasRenderingContext2D): void {
        const x = -Tank.hpBarLength / 2
        const y = this.radius + Tank.hpBarPadding - Tank.hpBarWidth / 2;

        X.fillStyle = "#aaaaaa";
        X.fillRect(x, y, Tank.hpBarLength, Tank.hpBarWidth);
        X.fillStyle = "#00dd00";
        X.fillRect(x, y, Tank.hpBarLength * this.health / this.maxHealth, Tank.hpBarWidth);
    }

    private doMovement(deltaTime: number): void {
        const [ax, ay] = this.normalize(this.getMovement(deltaTime), 1);
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
        const bullet = new Bullet(
            this.game,
            this.x + Math.cos(this.rotation) * this.radius,
            this.y + Math.sin(this.rotation) * this.radius,
            0.25 + 0.03 * this.build.bulletSpeed ** 1.4,
            this.rotation + (Math.random() - 0.5) * this.unstableness,
            this.build.bulletPenetration * 0.2,
            this.build.bulletDamage * 0.2
        );
        bullet.setFirer(this);
        this.game.addEntity(bullet);
    }

    private normalize(vec: [number, number], scale: number = 1): [number, number] {
        if (vec[0] === 0 && vec[1] === 0) { return [0, 0]; }
        const ang = Math.atan2(vec[1], vec[0]);
        return [Math.cos(ang) * scale, Math.sin(ang) * scale];
    }

    private heal(deltaTime: number): void {
        this.timeToQuickHeal -= deltaTime;
        let rate;

        if (this.timeToQuickHeal < 0) {
            rate = 0.005;
        } else {
            rate = this.regenRate;
        }

        this.health = Math.min(this.maxHealth, this.health + deltaTime * rate);
    }
}

export default Tank;