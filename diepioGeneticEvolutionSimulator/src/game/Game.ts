import Entity from "./Entity";
import Engine from "./engine/Engine";
import Square from "./entities/polygons/Square";
import Triangle from "./entities/polygons/Triangle";
import Pentagon from "./entities/polygons/Pentagon";
import Player from "./entities/tank/Player";
import Boundaries from "./entities/Boundaries";
import GeneticTank from "./entities/tank/GeneticTank";
import Genes from "./entities/tank/Genes";
import Polygon from "./entities/Polygon";

class Game {
    public entities: Entity[];

    private engine: Engine;
    private boundaries: Boundaries;

    constructor() {
        this.entities = [];
        this.engine = new Engine(this.entities);
        this.boundaries = new Boundaries(16000, 16000);
        // this.boundaries = new Boundaries(400, 400);
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
        this.engine.newEntity(entity);
    }

    private reqanf() {
        this.engine.render();
        requestAnimationFrame(this.reqanf.bind(this));
    }

    private createInitalShapes(): void {
        for (let i = 0; i < 800; i++) {
            // for (let j = 0; j < 25; j++) {
            //     this.addEntity(new Bullet(this, i * 24, j * 24, 0, 0));
            // }
            this.addEntity(new Square(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.addEntity(new Triangle(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.addEntity(new Pentagon(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
        }

        // {
        //     const player = new Player(this, 0, 0);
        //     this.engine.attachCameraTo(player);
        //     player.setGodMode();
        //     this.addEntity(player);
        // }

        setInterval(() => {
            if (this.entities.filter(e => e instanceof Polygon).length > 2400) {
                return;
            }

            this.addEntity(new Square(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.addEntity(new Triangle(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.addEntity(new Pentagon(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
        }, 3000);


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