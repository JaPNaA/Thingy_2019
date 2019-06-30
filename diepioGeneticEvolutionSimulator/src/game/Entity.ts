import IRenderable from "./engine/interfaces/IRenderable";
import ITickable from "./engine/interfaces/ITickable";
import IColliable from "./engine/interfaces/ICollidable";
import Ticker from "./engine/Ticker";

abstract class Entity implements IRenderable, ITickable, IColliable {
    public abstract x: number;
    public abstract y: number;
    public abstract vx: number;
    public abstract vy: number;
    public abstract radius: number;
    public abstract rotation: number;
    public abstract health: number;

    public abstract render(X: CanvasRenderingContext2D): void;
    public abstract tick(deltaTime: number): void;
    public abstract collideWith(other: Entity): void;

    public fixedTick(): void {
        this.x += this.vx * Ticker.fixedTime;
        this.y += this.vy * Ticker.fixedTime;
    }
}

export default Entity;