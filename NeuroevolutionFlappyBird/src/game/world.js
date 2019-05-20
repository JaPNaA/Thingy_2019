import Wall from "./wall";

/**
 * @typedef {import("./bird").default} Bird
 */

class World {
    constructor() {
        /** @type {Bird[]} */
        this.birds = [];
        /** @type {Wall[]} */
        this.walls = [];
        /** @type {number} */
        this.timeToNewWall = 0;

        /** @type {number} */
        this.distance = 0;
    }

    /**
     * Ticks everything in world
     */
    tick() {
        for (const bird of this.birds) {
            bird.tick();
        }

        for (let i = this.walls.length - 1; i >= 0; i--) {
            const wall = this.walls[i];
            if (wall.x + wall.width < 0) {
                this.walls.splice(i, 1);
            }
        }

        for (const wall of this.walls) {
            wall.tick();
        }

        for (const bird of this.birds) {
            bird.collideWithWalls();
        }

        this.timeToNewWall -= World.speed;
        this.distance += World.speed;

        if (this.timeToNewWall <= 0) {
            this.walls.push(new Wall());
            this.timeToNewWall = World.newWallCooldown;
        }
    }

    /**
     * @param {CanvasRenderingContext2D} X 
     */
    draw(X) {
        for (const bird of this.birds) {
            bird.draw(X);
        }

        for (const wall of this.walls) {
            wall.draw(X);
        }
    }

    /**
     * @param {Bird} bird 
     */
    addBird(bird) {
        this.birds.push(bird);
    }
}

World.gravity = 0.001;
World.speed = 0.01;
World.newWallCooldown = 0.75;

export default World;