/**
 * @abstract
 */
class Obj {
    /** @abstract */
    tick() { throw new Error("not implemented"); }
    /**
     * @param {CanvasRenderingContext2D} X 
     */
    // eslint-disable-next-line no-unused-vars
    draw(X) { throw new Error("not implemented"); }
}

export default Obj;