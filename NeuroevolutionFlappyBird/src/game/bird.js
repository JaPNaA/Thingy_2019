import Obj from "./obj";
import World from "./world";

/**
 * @typedef {import("./wall").default} Wall
 * @typedef {(y: number, vy: number, nextWallOpeningTop: number, nextWallOpeningBottom: number, distFromNextWall: number) => boolean} ShouldFlapFunction
 */

class Bird extends Obj {
    /**
     * @param {World} world
     * @param {ShouldFlapFunction} shouldFlap 
     */
    constructor(world, shouldFlap) {
        super();
        this.x = 0.05;
        this.y = 0;
        this.width = 0.04;
        this.height = 0.04;
        this.vy = 0;
        this.alive = true;
        this.shouldFlap = shouldFlap;
        this.world = world;
    }

    /**
     * @param {CanvasRenderingContext2D} X 
     */
    draw(X) {
        if (this.y > 1) { return; }
        if (this.alive) {
            X.fillStyle = "#0000ff";
        } else {
            X.fillStyle = "#ff0000";
        }
        X.fillRect(this.x, this.y, this.width, this.height);
    }

    tick() {
        this.vy += World.gravity;
        this.y += this.vy;

        const firstWall = this.getFirstWall();

        if (firstWall && this.alive) {
            if (this.shouldFlap(this.y, this.vy, firstWall.topOpening, firstWall.bottomOpening, firstWall.x - this.x)) {
                this.vy = -0.02;
            }
        }

    }

    /**
     * Gets the first wall from the bird
     * @returns {Wall|undefined}
     */
    getFirstWall() {
        for (const wall of this.world.walls) {
            if (wall.x + wall.width > this.x) {
                return wall;
            }
        }
    }

    /**
     * Checks and reacts to collisions with walls
     */
    collideWithWalls() {
        for (const wall of this.world.walls) {
            if (wall.isCollidingWith(this)) {
                this.die();
            }
        }
    }

    die() {
        this.alive = false;
    }
}

export default Bird;