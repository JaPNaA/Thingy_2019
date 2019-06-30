import Renderer from "./Renderer";
import Ticker from "./Ticker";
import Canvas from "./Canvas";
import IRenderable from "./interfaces/IRenderable";
import ITickable from "./interfaces/ITickable";
import CircleCollider from "./CircleCollider";
import IColliable from "./interfaces/ICollidable";

type Entity = IRenderable & ITickable & IColliable;

class Engine {
    public canvas: Canvas;
    private renderer: Renderer;
    private ticker: Ticker;
    private collider: CircleCollider;
    private entities: Entity[];

    constructor(entities: Entity[]) {
        this.canvas = new Canvas();
        this.renderer = new Renderer(this.canvas);
        this.ticker = new Ticker();
        this.collider = new CircleCollider();
        this.entities = entities;
    }

    public render() {
        this.ticker.tickAll(this.entities);
        this.collider.collideAll(this.entities);
        this.renderer.renderAll(this.entities);
    }

    public appendTo(parent: Element): void {
        this.canvas.appendTo(parent);
    }
}

export default Engine;