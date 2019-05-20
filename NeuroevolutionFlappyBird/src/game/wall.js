import Obj from "./obj";
import World from "./world";

/**
 * @typedef {import("./bird").default} Bird
 */

class Wall extends Obj {
    constructor() {
        super();
        this.x = 1;
        this.width = Wall.width;
        this.topOpening = Math.random() * (1 - Wall.openingSize);
        this.bottomOpening = this.topOpening + Wall.openingSize;
    }

    tick() {
        this.x -= World.speed;
    }

    /**
     * @param {CanvasRenderingContext2D} X 
     */
    draw(X) {
        X.fillStyle = "#000000";
        X.fillRect(this.x, 0, Wall.width, this.topOpening);
        X.fillRect(this.x, this.bottomOpening, Wall.width, 1 - this.bottomOpening);
    }

    /**
     * Checks if is colliding with bird
     * @param {Bird} bird 
     * @returns {boolean}
     */
    isCollidingWith(bird) {
        return (
            bird.x + bird.width > this.x &&
            bird.x < this.x + this.width && (
                bird.y < this.topOpening ||
                bird.y + bird.height > this.bottomOpening
            )
        );
    }
}

Wall.openingSize = 0.25;
Wall.width = 0.1;

export default Wall;