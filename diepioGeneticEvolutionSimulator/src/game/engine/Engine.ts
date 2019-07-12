import Renderer from "./Renderer";
import Ticker from "./Ticker";
import Canvas from "./Canvas";
import CircleCollider from "./CircleCollider";
import Bounder from "./Bounder";
import Boundaries from "../entities/Boundaries";
import Remover from "./Remover";
import Camera from "./Camera";
import IEntity from "./interfaces/IEntity";
import { mouse } from "./ui/Mouse";
import CircleQuadTree from "./CircleQuadTree";

class Engine<T extends IEntity> {
    private camera: Camera;

    public canvas: Canvas;
    private renderer: Renderer;
    private ticker: Ticker<T>;
    private collider: CircleCollider<T>;
    private bounder: Bounder;
    private remover: Remover<T>;
    private entities: T[];

    constructor(entities: T[]) {
        this.canvas = new Canvas();
        this.camera = new Camera(this.canvas);
        this.renderer = new Renderer(this.canvas, this.camera);
        this.collider = new CircleCollider();
        this.ticker = new Ticker();
        this.remover = new Remover(this.collider);
        this.bounder = new Bounder();
        this.entities = entities;

        mouse.attachCamera(this.camera);
    }

    public render() {
        this.ticker.tickAll(this.entities);
        this.collider.collideAll(this.entities);
        this.bounder.boundAll(this.entities);
        this.remover.removeAllIfDestoryed(this.entities);

        this.renderer.renderEntitiesInTree(this.collider.quadTree);
        // this.renderer.debugRenderQuadtree(this.collider.quadTree);
    }

    public attachCameraTo(entity: T): void {
        this.camera.attachTo(entity);
    }

    public setBoundaries(boundaries: Boundaries): void {
        this.bounder.setBoundaries(boundaries);
        this.collider.setBoundaries(boundaries);
    }

    public newEntity(entity: T): void {
        this.collider.newEntity(entity);
    }

    public appendTo(parent: Element): void {
        this.canvas.appendTo(parent);
    }

    public getQuadTree(): CircleQuadTree<T> {
        return this.collider.getQuadTree();
    }
}

export default Engine;