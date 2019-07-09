import Renderer from "./Renderer";
import Ticker from "./Ticker";
import Canvas from "./Canvas";
import CircleCollider from "./CircleCollider";
import Bounder from "./Bounder";
import Boundaries from "../entities/Boundaries";
import Remover from "./Remover";
import Camera from "./Camera";
import IEntity from "./interfaces/IEntity";

class Engine {
    private camera: Camera;

    public canvas: Canvas;
    private renderer: Renderer;
    private ticker: Ticker;
    private collider: CircleCollider;
    private bounder: Bounder;
    private remover: Remover;
    private entities: IEntity[];

    constructor(entities: IEntity[]) {
        this.camera = new Camera();
        this.canvas = new Canvas();
        this.renderer = new Renderer(this.canvas, this.camera);
        this.collider = new CircleCollider();
        this.ticker = new Ticker(this.collider);
        this.remover = new Remover(this.collider);
        this.bounder = new Bounder();
        this.entities = entities;
    }

    public render() {
        this.ticker.tickAll(this.entities);
        this.collider.collideAll(this.entities);
        this.bounder.boundAll(this.entities);
        this.remover.removeAllIfDestoryed(this.entities);

        this.renderer.renderAll(this.entities);
        this.renderer.debugRenderQuadtree(this.collider);
    }

    public setBoundaries(boundaries: Boundaries): void {
        this.bounder.setBoundaries(boundaries);
        this.collider.setBoundaries(boundaries);
    }

    public newEntity(entity: IEntity): void {
        this.collider.newEntity(entity);
    }

    public appendTo(parent: Element): void {
        this.canvas.appendTo(parent);
    }
}

export default Engine;