import Entity from "./Entity";
import Engine from "./engine/Engine";
import Square from "./entities/polygons/Square";
import Triangle from "./entities/polygons/Triangle";
import Pentagon from "./entities/polygons/Pentagon";
import Boundaries from "./entities/Boundaries";
import GeneticTank from "./entities/tank/GeneticTank";
import Genes from "./entities/tank/Genes";
import Polygon from "./entities/Polygon";
import CircleQuadTree from "./engine/CircleQuadTree";
import DataViewer from "./dataViewer/DataViewer";
import Tank from "./entities/tank/Tank";

type PolygonClass = new (game: Game, x: number, y: number) => Polygon;

class Game {
    public entities: Entity[];
    public quadTree: CircleQuadTree<Entity>;

    // small
    // private static initalTanks: number = 3;
    // private static maintainTanks: number = 3;
    // private static targetEntities: number = 20;
    // private static size: number = 720;

    // large
    private static initalTanks: number = 96;
    private static maintainTanks: number = 32;
    private static targetEntities: number = 2400;
    private static size: number = 16000;

    private static titleDelay: number = 2000;

    private static spawnrates: [PolygonClass, number][] = [
        [Square, 0.5],
        [Triangle, 0.3],
        [Pentagon, 0.2]
    ];

    private engine: Engine<Entity>;
    private boundaries: Boundaries;
    private dataViewer: DataViewer;

    constructor() {
        this.entities = [];
        this.engine = new Engine(this.entities);
        this.boundaries = new Boundaries(Game.size, Game.size);
        this.engine.setBoundaries(this.boundaries);
        this.quadTree = this.engine.getQuadTree();
        this.dataViewer = new DataViewer(this, this.engine);
        this.setup();

        this.engine.camera.gotoNoTransition(Game.size / 2, Game.size / 2, Math.max(innerWidth, innerHeight) * 2);
        setTimeout(() =>
            this.engine.camera.goto(Game.size / 2, Game.size / 2, 1),
            Game.titleDelay
        );
    }

    public setup(): void {
        this.populateInital();
        this.reqanf();
    }

    public appendTo(parent: Element) {
        this.engine.appendTo(parent);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.engine.newEntity(entity);
    }

    /**
     * Gets rid of half of the entities randomly
     */
    public thanosSnap(): void {
        for (const entity of this.entities) {
            if (Math.random() < 0.5) {
                entity.destory();
            }
        }
    }

    private reqanf() {
        const now = performance.now();
        this.engine.render();
        this.createShapesToTarget();
        this.maintainTankNumbers();

        if (now < Game.titleDelay) {
            this.drawName(now);
        }

        requestAnimationFrame(this.reqanf.bind(this));
    }

    private drawName(now: number) {
        const X = this.engine.canvas.getX();
        const x = this.engine.canvas.width / 2;
        const y = this.engine.canvas.height / 2;
        X.save();
        X.globalAlpha = Math.min((1 - now / Game.titleDelay) * 2, 1);
        X.textBaseline = "middle";
        X.textAlign = "center";
        X.font = Math.min(innerWidth * 0.06, 64) + "px Ubuntu, Arial";
        X.fillStyle = "#000000";
        X.fillText("diep.io Genetic Evolution Simulator", x, y);
        X.restore();
    }

    private createShapesToTarget(): void {
        let amount = this.entities.length;
        for (; amount < Game.targetEntities; amount++) {
            this.spawnShape();
        }
    }

    private maintainTankNumbers(): void {
        let amount = 0;
        for (const entity of this.entities) {
            if (entity instanceof Tank) {
                amount++;
                if (amount >= Game.maintainTanks) { return; }
            }
        }

        for (; amount < Game.maintainTanks; amount++) {
            this.addEntity(new GeneticTank(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height,
                new Genes()
            ));
        }
    }

    private spawnShape(): void {
        const rand = Math.random();
        let total = 0;

        for (const [entityType, rate] of Game.spawnrates) {
            total += rate;
            if (rand < total) {
                this.addEntity(new entityType(
                    this,
                    Math.random() * this.boundaries.width,
                    Math.random() * this.boundaries.height
                ));
                break;
            }
        }
    }

    private populateInital(): void {
        for (let i = 0; i < Game.initalTanks; i++) {
            this.addEntity(new GeneticTank(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height,
                new Genes()
            ));
        }
    }
}

export default Game;