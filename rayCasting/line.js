import Obj from "./obj.js";

/**
 * @typedef {import("./world").default} World
 */

class Line extends Obj {
    /**
     * Creates a line segment
     * @param {World} world
     * @param {number} startX 
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    constructor(world, startX, startY, endX, endY) {
        super(world);
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    /**
     * Draws line
     * @param {CanvasRenderingContext2D} X 
     */
    render(X) {
        X.lineWidth = 1;
        X.strokeStyle = "#000000";

        X.beginPath();
        X.moveTo(this.startX, this.startY);
        X.lineTo(this.endX, this.endY);
        X.stroke();
    }
}

export default Line;