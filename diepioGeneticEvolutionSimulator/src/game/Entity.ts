import Ticker from "./engine/Ticker";
import Game from "./Game";
import IEntity from "./engine/interfaces/IEntity";

abstract class Entity implements IEntity {
    public abstract x: number;
    public abstract y: number;
    public abstract vx: number;
    public abstract vy: number;
    public abstract radius: number;
    public abstract rotation: number;
    public abstract health: number;
    public abstract damage: number;
    public abstract targetable: boolean;

    public _quadTreeX: number = 0;
    public _quadTreeY: number = 0;
    public _collisionObj?: Entity;

    public destoryed: boolean;
    public teamID: number;

    protected game: Game;

    private static teamIDIncrementer: number = 0;

    constructor(game: Game) {
        this.game = game;
        this.destoryed = false;
        this.teamID = Entity.teamIDIncrementer++;
    }

    public abstract render(X: CanvasRenderingContext2D): void;
    public abstract tick(deltaTime: number): void;

    public collideWith(other: Entity): void {
        if (other.destoryed) { return; }
        this.damageHit(other);
    }

    public setTeamID(id: number): void {
        this.teamID = id;
    }

    public destory(by?: Entity): void {
        this.destoryed = true;
    }

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;
    }

    public __debugRenderHitCircle(X: CanvasRenderingContext2D): void {
        X.strokeStyle = "#ff0000";
        X.lineWidth = 2;
        X.beginPath();
        X.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        X.stroke();
    }

    protected damageHit(by: Entity): void {
        if (by.teamID === this.teamID) { return; }
        const otherHealth = by.health - this.damage * this.health;
        const thisHealth = this.health - by.damage * by.health;
        by.health = otherHealth;
        this.health = thisHealth;

        if (otherHealth <= 0) {
            by.destory(this);
        }
        if (thisHealth <= 0) {
            this.destory(by);
        }

        this.reactHit(by);
        by.reactHit(this);
    }

    protected reactHit(by: Entity): void { }

    protected resetTeamId(): void {
        this.teamID = Entity.teamIDIncrementer++;
    }
}

export default Entity;