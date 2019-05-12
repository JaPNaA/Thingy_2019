/**
 * @typedef {import("./obj").default} Obj
 */

class World {
    constructor() {
        /** @type {Obj[]} */
        this.objs = [];
    }

    /**
     * Renders the objects in world
     * @param {CanvasRenderingContext2D} X rendering context
     */
    render(X) {
        X.clearRect(0, 0, X.canvas.width, X.canvas.height);
        for (const obj of this.objs) {
            obj.render(X);
        }

        X.fillStyle = "#000000";
        X.font = "16px Arial";
        X.fillText("Left/right click to move lights", 36, 32);
    }

    /**
     * Adds and obj to the world
     * @param {Obj} obj
     */
    add(obj) {
        this.objs.push(obj);
    }
}

export default World;