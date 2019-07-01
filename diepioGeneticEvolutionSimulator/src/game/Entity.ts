import IRenderable from "./engine/interfaces/IRenderable";
import ITickable from "./engine/interfaces/ITickable";
import IColliable from "./engine/interfaces/ICollidable";
import Ticker from "./engine/Ticker";
import Game from "./Game";
import IRemovable from "./engine/interfaces/IRemovable";

abstract class Entity implements IRenderable, ITickable, IColliable, IRemovable {
    public abstract x: number;
    public abstract y: number;
    public abstract vx: number;
    public abstract vy: number;
    public abstract radius: number;
    public abstract rotation: number;
    public abstract health: number;
    public abstract damage: number;

    public destoryed: boolean;

    protected teamID: number;
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
        this.damageHit(other);
    }

    public setTeamID(id: number): void {
        this.teamID = id;
    }

    public destory(): void {
        this.destoryed = true;
    }

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;
    }

    protected damageHit(other: Entity): void {
        if (other.teamID === this.teamID) { return; }
        const otherHealth = other.health - this.damage * this.health;
        const thisHealth = this.health - other.damage * other.health;
        other.health = otherHealth;
        this.health = thisHealth;

        if (otherHealth <= 0) {
            other.destory();
        }
        if (thisHealth <= 0) {
            this.destory();
        }
    }
}

export default Entity;