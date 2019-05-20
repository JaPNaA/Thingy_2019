import World from "./world";
import Bird from "./bird";

/**
 * @typedef {import("./bird").default} Bird
 */

class Game {
    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.world = new World();
    }

    /**
     * Ticks world
     */
    tick() {
        this.world.tick();
        if (this.world.distance > Game.highest) {
            Game.highest = this.world.distance;
        }
    }

    /**
     * Draws scene
     * @param {CanvasRenderingContext2D} X
     */
    draw(X) {
        X.clearRect(0, 0, this.width, this.height);
        const scale = Math.min(this.width, this.height);
        X.scale(scale, scale);
        this.world.draw(X);
        X.resetTransform();

        X.fillStyle = "#888888";
        X.font = "16px Arial";
        X.fillText(
            (Math.floor(this.world.distance * 10) / 10).toString(),
            8, 38
        );
        X.fillText(
            "Highest: " + (Math.floor(Game.highest * 10) / 10).toString(),
            8, 22
        );
    }

    /**
     * Adds a bird to the world
     * @param {import("./bird").ShouldFlapFunction} birdFunc 
     * @returns {Bird}
     */
    addBird(birdFunc) {
        const bird = new Bird(this.world, birdFunc);
        this.world.addBird(bird);
        return bird;
    }
}

Game.highest = 0;

export default Game;