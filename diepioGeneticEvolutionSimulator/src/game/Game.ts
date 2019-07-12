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

type PolygonClass = new (game: Game, x: number, y: number) => Polygon;

class Game {
    public entities: Entity[];
    public quadTree: CircleQuadTree<Entity>;

    private static targetEntities: number = 2400;
    private static spawnrates: [PolygonClass, number][] = [
        [Square, 0.5],
        [Triangle, 0.3],
        [Pentagon, 0.2]
    ];

    private engine: Engine<Entity>;
    private boundaries: Boundaries;

    constructor() {
        this.entities = [];
        this.engine = new Engine(this.entities);
        this.boundaries = new Boundaries(16000, 16000);
        this.engine.setBoundaries(this.boundaries);
        this.quadTree = this.engine.getQuadTree();
        this.setup();
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
        this.engine.render();
        this.createShapesToTarget();

        requestAnimationFrame(this.reqanf.bind(this));
    }

    private createShapesToTarget(): void {
        let amount = this.entities.length;
        for (; amount < Game.targetEntities; amount++) {
            this.spawnShape();
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
        for (let i = 0; i < 96; i++) {
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