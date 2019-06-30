import Entity from "./Entity";
import Engine from "./engine/Engine";
import Square from "./entities/polygons/Square";
import Triangle from "./entities/polygons/Triangle";
import Pentagon from "./entities/polygons/Pentagon";
import Player from "./entities/tank/Player";
import Boundaries from "./entities/Boundaries";
import GeneticTank from "./entities/tank/GeneticTank";
import Genes from "./entities/tank/Genes";

class Game {
    public entities: Entity[];

    private engine: Engine;
    private boundaries: Boundaries;

    constructor() {
        this.entities = [];
        this.engine = new Engine(this.entities);
        this.boundaries = new Boundaries(1280, 720);
        this.setup();
    }

    public setup(): void {
        this.engine.setBoundaries(this.boundaries);
        this.reqanf();
        this.createInitalShapes();
    }

    public appendTo(parent: Element) {
        this.engine.appendTo(parent);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
    }

    private reqanf() {
        this.engine.render();
        requestAnimationFrame(this.reqanf.bind(this));
    }

    private createInitalShapes(): void {
        for (let i = 0; i < 25; i++) {
            // for (let j = 0; j < 25; j++) {
            //     this.entities.push(new Bullet(this, i * 24, j * 24, 0, 0));
            // }
            this.entities.push(new Square(
                this,
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
            this.entities.push(new Triangle(
                this,
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
            this.entities.push(new Pentagon(
                this,
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
        }

        this.entities.push(new Player(
            this, // 860, 580
            Math.random() * this.engine.canvas.width,
            Math.random() * this.engine.canvas.height
        ));

        for (let i = 0; i < 5; i++) {
            this.entities.push(new GeneticTank(
                this,
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height,
                new Genes()
            ));
        }
    }
}

export default Game;