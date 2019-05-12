/**
 * @typedef {import("./world").default} World
 */

class Obj {
    /**
     * @param {World} world 
     */
    constructor(world) {
        this.world = world;
    }
    /**
     * Renders obj
     * @param {CanvasRenderingContext2D} X 
     */
    // eslint-disable-next-line no-unused-vars
    render(X) { throw new Error("not implemented"); }
}

export default Obj;