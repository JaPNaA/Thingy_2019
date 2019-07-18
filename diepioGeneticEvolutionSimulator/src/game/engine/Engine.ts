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
    public canvas: Canvas;
    public camera: Camera;

    private renderer: Renderer;
    private ticker: Ticker<T>;
    private collider: CircleCollider<T>;
    private bounder: Bounder;
    private remover: Remover<T>;
    private entities: T[];
    private renderHooks: Function[];

    constructor(entities: T[]) {
        this.canvas = new Canvas();
        this.camera = new Camera(this.canvas);
        this.renderer = new Renderer(this.canvas, this.camera);
        this.collider = new CircleCollider();
        this.ticker = new Ticker();
        this.remover = new Remover(this.collider);
        this.bounder = new Bounder();
        this.entities = entities;

        this.renderHooks = [];
        mouse.attachCamera(this.camera);
    }

    public render() {
        this.ticker.tickAll(this.entities);
        this.collider.collideAll(this.entities);
        this.bounder.boundAll(this.entities);
        this.remover.removeAllIfDestoryed(this.entities);

        this.camera.updateLocation();
        this.renderer.renderEntitiesInTree(this.collider.quadTree);
        // this.renderer.debugRenderQuadtree(this.collider.quadTree);
        for (const hook of this.renderHooks) {
            hook();
        }
    }

    public attachCameraTo(entity?: T): void {
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

    public onRender(cb: Function): void {
        this.renderHooks.push(cb);
    }
}

export default Engine;