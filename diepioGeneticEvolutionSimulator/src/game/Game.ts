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
        this.boundaries = new Boundaries(4000, 4000);
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
        for (let i = 0; i < 50; i++) {
            // for (let j = 0; j < 25; j++) {
            //     this.entities.push(new Bullet(this, i * 24, j * 24, 0, 0));
            // }
            this.entities.push(new Square(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.entities.push(new Triangle(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.entities.push(new Pentagon(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
        }

        setInterval(() => {
            if (this.entities.filter(e => e instanceof Polygon).length > 150) {
                return;
            }

            this.entities.push(new Square(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.entities.push(new Triangle(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
            this.entities.push(new Pentagon(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height
            ));
        }, 3000);

        // this.entities.push(new Player(
        //     this, // 860, 580
        //     Math.random() * this.boundaries.width,
        //     Math.random() * this.boundaries.height
        // ));

        for (let i = 0; i < 8; i++) {
            this.entities.push(new GeneticTank(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height,
                new Genes()
            ));
        }
    }
}

export default Game;