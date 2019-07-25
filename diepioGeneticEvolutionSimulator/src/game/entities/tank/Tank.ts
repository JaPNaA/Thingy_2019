import Entity from "../../Entity";
import Ticker from "../../engine/Ticker";
import Game from "../../Game";
import circleCircleElasticCollision from "../../collisions/polygon-polygon";
import Bullet from "../Bullet";
import TankBuild from "./TankBuild";
import TankLevels from "./TankLevels";
import { IXPGivable, isXPGivable } from "../IXPGivable";
import { TankClass, basicTank } from "./TankClass";
import TankCanon from "./TankCanon";

abstract class Tank extends Entity implements IXPGivable {
    public static initalRadius = 24;
    public static quickHealDelay: number = 60_000;

    public static initalCooldownSpeed = 1000;
    public static baseSpeed = 0.00035;
    public static baseRegenRate: number = 0.0001;
    public static baseMaxHealth: number = 16;
    public static baseDamage: number = 0.5;

    public radius: number = Tank.initalRadius;
    public damage: number;
    public health: number;
    public rotation: number;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public targetable = true;

    public _canSleep = false;

    public build: TankBuild;
    public levels: TankLevels;
    public tankClass: TankClass;

    protected unstableness: number = 0;
    protected range: number = 720;
    protected scale: number;
    protected maxHealth: number;

    protected cooldownSpeed: number;
    protected speed: number;
    protected regenRate: number;

    protected ax: number;
    protected ay: number;

    protected hue: number = Math.random() * 360;

    private static fixedFriction: number = 0.995 ** Ticker.fixedTime;
    private static hpBarLength: number = 1;
    private static hpBarWidth: number = 4;
    private static hpBarPadding: number = 0.5;

    // private canonWidth: number = 0.75;
    // private canonLength: number = 0.85;
    // private cooldown: number;

    private timeToQuickHeal: number;

    constructor(game: Game, x: number, y: number, tankClass: TankClass = basicTank) {
        super(game);

        this.tankClass = tankClass.clone();

        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.rotation = 0;
        this.damage = Tank.baseDamage;

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

        X.lineWidth = 3;
        X.lineJoin = "round";

        X.rotate(this.rotation);
        X.fillStyle = "#939393";
        X.strokeStyle = "#6d6d6d";

        let currAngOffset = 0;

        for (const canon of this.tankClass.canons) {
            if (!canon.visible) { continue; }
            const canonWidth = canon.width * this.radius;
            const canonLength = canon.length * this.radius;

            X.rotate(canon.angle - currAngOffset);
            currAngOffset = canon.angle;
            X.beginPath();
            X.rect(0, -canonWidth / 2, canonLength + this.radius, canonWidth);
            X.fill();
            X.stroke();
        }

        X.strokeStyle = "hsl(" + this.hue + ",79%,35%)";
        X.fillStyle = "hsl(" + this.hue + ",78%,49%)";
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

    public destory(by?: Entity): void {
        super.destory(by);
        if (isXPGivable(by)) {
            by.giveXP(Math.min(this.levels.totalXP * 0.75, TankLevels.requiredForLastLevel));
        }
    }

    protected abstract getMovement(deltaTime: number): [number, number];
    protected abstract getDirection(): [number, number];
    protected abstract getTriggered(): boolean;

    protected onLevelUp(): void {
        this.scale = 1.02 ** (this.levels.level - 1);
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
        this.damage = Tank.baseDamage * (1 + (this.build.bodyDamage ** 1.4) * 0.1);

        const healthRatio = this.health / this.maxHealth;
        this.maxHealth = Tank.baseMaxHealth * (1 + (this.build.maxHealth ** 1.4) * 0.1);
        this.health = this.maxHealth * healthRatio;
    }

    private drawHPBar(X: CanvasRenderingContext2D): void {
        const length = Tank.hpBarLength * this.radius * 2;
        const x = -length / 2
        const y = this.radius + Tank.hpBarPadding * this.radius;

        X.lineCap = "round";

        X.lineWidth = Tank.hpBarWidth + 3;
        X.strokeStyle = "#515151";
        X.beginPath();
        X.moveTo(x, y);
        X.lineTo(x + length, y);
        X.stroke();

        X.lineWidth = Tank.hpBarWidth;
        X.strokeStyle = "#83e079";
        X.beginPath();
        X.moveTo(x, y);
        X.lineTo(x + length * this.health / this.maxHealth, y);
        X.stroke();
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
        for (const canon of this.tankClass.canons) {
            const cooldown = canon.cooldownTime * this.cooldownSpeed;
            canon.warmth += deltaTime;

            if (this.getTriggered()) {
                const cooldownAndOffset = cooldown * (1 + canon.offset);

                while (canon.warmth >= cooldownAndOffset) {
                    canon.warmth -= cooldown;
                    this.fireBullet(canon);
                }
            } else {
                if (canon.warmth > cooldown) {
                    canon.warmth = cooldown;
                }
            }
        }
    }

    private fireBullet(canon: TankCanon): void {
        const bulletRadius = canon.width * this.radius / 2;
        const ang = this.rotation + canon.angle;

        // create bullet
        const power = canon.bulletPower / this.tankClass.powerDivider;
        const bullet = new Bullet(
            this.game,
            this.x + Math.cos(ang) * (this.radius + bulletRadius),
            this.y + Math.sin(ang) * (this.radius + bulletRadius),
            0.25 + 0.03 * this.build.bulletSpeed ** 1.4,
            ang + (Math.random() - 0.5) * (this.unstableness + canon.unstableness),
            0.5 + (0.5 + this.build.bulletPenetration * 0.2),
            0.5 + (0.5 + this.build.bulletDamage * 0.2) * power,
            bulletRadius,
            this.hue
        );
        bullet.setFirer(this);
        this.game.addEntity(bullet);

        // pushback
        const pushback = bulletRadius * (1 + this.build.bulletSpeed) * 0.0025;
        this.vx -= Math.cos(ang) * pushback;
        this.vy -= Math.sin(ang) * pushback;
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