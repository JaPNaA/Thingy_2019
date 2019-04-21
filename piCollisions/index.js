const canvas = document.createElement("canvas");
const X = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

class World {
    constructor() {
        /** @type {Block[]} */
        this.blocks = [];
        /** @type {number} */
        this.floorY = 400;
        /** @type {number} */
        this.collisions = 0;
    }

    /**
     * @param {Block} block;
     */
    addBlock(block) {
        this.blocks.push(block);
    }

    draw() {
        X.fillStyle = "rgba(0,0,0,0.1)";
        X.fillRect(0, 0, canvas.width, canvas.height);

        for (const block of this.blocks) {
            block.draw();
        }
    }

    tick() {
        for (const block of this.blocks) {
            block.tick();
        }

        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = i + 1; j < this.blocks.length; j++) {
                this.blocks[i].collideWith(this.blocks[j]);
            }
        }

        X.font = "48px Consolas, monospace";
        X.textAlign = "right";
        X.fillText(this.collisions.toString(), 764, 64);
    }

    addCollision() {
        this.collisions++;
    }
}

class Block {
    /**
     * @param {World} world
     * @param {number} width
     * @param {number} height
     * @param {number} mass
     * @param {number} x
     * @param {number} vx
     */
    constructor(world, width, height, mass, x, vx) {
        this.world = world;
        this.width = width;
        this.height = height;
        this.mass = mass;
        this.x = x;
        this.vx = vx;
    }

    draw() {
        X.fillStyle = "#888888";
        X.fillRect(this.x, this.world.floorY - this.height, this.width, this.height);
    }

    tick() {
        if (this.x < 0) {
            this.x = Math.abs(this.x);
            this.vx = Math.abs(this.vx);
            this.world.addCollision();
        }
        this.x += this.vx;
    }

    /**
     * @param {Block} other 
     */
    collideWith(other) {
        if (
            this.x < other.x + other.width
        ) {
            const left = this.x;
            const right = other.x + other.width;
            const collisionX = this.vx * ((right - left) / (this.vx - other.vx)) + left;

            X.fillRect(collisionX - 1, 0, 2, 2500);

            if (collisionX > 0) {
                this.x = collisionX;
                other.x = collisionX - other.width;
            }

            const v1f = ((this.mass - other.mass) / (this.mass + other.mass)) * this.vx + ((2 * other.mass) / (this.mass + other.mass)) * other.vx;
            const v2f = ((2 * this.mass) / (other.mass + this.mass)) * this.vx + ((other.mass - this.mass) / (other.mass + this.mass)) * other.vx;
            this.vx = v1f;
            other.vx = v2f;

            this.world.addCollision();
        }
    }
}

const world = new World();
const digits = 3;
world.addBlock(new Block(world, 72, 72, 100 ** digits, 486, -1));
world.addBlock(new Block(world, 64, 64, 1, 64, 0));

document.getElementById("numDig").innerHTML = (digits + 1).toString();
document.getElementById("goal").innerHTML = Math.floor(Math.PI * (10 ** digits)).toString();

function reqanf() {
    world.draw();
    world.tick();
    requestAnimationFrame(reqanf);
}

reqanf();