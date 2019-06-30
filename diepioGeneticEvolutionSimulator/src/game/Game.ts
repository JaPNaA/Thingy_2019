import Entity from "./Entity";
import Engine from "./engine/Engine";
import Square from "./entities/polygons/Square";
import Triangle from "./entities/polygons/Triangle";
import Pentagon from "./entities/polygons/Pentagon";
import Player from "./entities/Player";

class Game {
    private entities: Entity[];
    private engine: Engine;

    constructor() {
        this.entities = [];
        this.engine = new Engine(this.entities);
        this.setup();
    }

    public setup(): void {
        this.reqanf();
        this.createInitalShapes();
    }

    public appendTo(parent: Element) {
        this.engine.appendTo(parent);
    }

    private reqanf() {
        this.engine.render();
        requestAnimationFrame(this.reqanf.bind(this));
    }

    private createInitalShapes(): void {
        for (let i = 0; i < 25; i++) {
            this.entities.push(new Square(
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
            this.entities.push(new Triangle(
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
            this.entities.push(new Pentagon(
                Math.random() * this.engine.canvas.width,
                Math.random() * this.engine.canvas.height
            ));
        }

        this.entities.push(new Player(
            Math.random() * this.engine.canvas.width,
            Math.random() * this.engine.canvas.height
        ));
    }
}

export default Game;