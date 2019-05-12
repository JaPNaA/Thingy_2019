import Obj from "./obj.js";
import getLineRayIntersection from "./getRayLineIntersection.js";
import Line from "./line.js";
/**
 * @typedef {import("./world").default} World
 */

const ELIPSON = 0.000001;

class Light extends Obj {
    /**
     * @param {World} world 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(world, x, y) {
        super(world);
        this.x = x;
        this.y = y;
    }

    /**
     * Renders a light
     * @param {CanvasRenderingContext2D} X 
     */
    render(X) {
        X.save();
        X.fillStyle = "#ff0000";
        X.globalAlpha = 0.2;
        X.lineWidth = 1;

        /**
         * @type {[number, [number, number, number]][]}
         */
        const intersections = [];

        for (const obj of this.world.objs) {
            if (!(obj instanceof Line)) { continue; }
            const startAng = Math.atan2(obj.startY - this.y, obj.startX - this.x);
            const endAng = Math.atan2(obj.endY - this.y, obj.endX - this.x);

            for (const theta of [
                startAng - ELIPSON,
                startAng + ELIPSON,
                endAng - ELIPSON,
                endAng + ELIPSON
            ]) {
                const intersection = this._getClosestIntersection(theta);

                if (intersection) {
                    intersections.push([theta, intersection]);
                }
            }
        }

        // for (const intersection of intersections) {
        //     X.beginPath();
        //     X.moveTo(this.x, this.y);
        //     X.lineTo(intersection[1][0], intersection[1][1]);
        //     X.stroke();
        // }

        intersections.sort((a, b) => a[0] - b[0]);

        if (intersections.length > 1) {
            X.beginPath();
            X.moveTo(intersections[0][1][0], intersections[0][1][1]);
            for (let i = 1; i < intersections.length; i++) {
                X.lineTo(intersections[i][1][0], intersections[i][1][1]);
            }
            X.closePath();
            X.fill();
        }

        X.restore();

        X.fillStyle = "#ff0000";
        X.fillRect(this.x - 4, this.y - 4, 8, 8);
    }

    /**
     * @param {number} theta 
     */
    _getClosestIntersection(theta) {
        const x = Math.cos(theta);
        const y = Math.sin(theta);

        let intersection;
        for (const obj of this.world.objs) {
            if (obj instanceof Line) {
                const newIntersection = getLineRayIntersection(
                    this.x, this.y, this.x + x, this.y + y,
                    obj.startX, obj.startY, obj.endX, obj.endY
                );

                if (!intersection || newIntersection && newIntersection[2] < intersection[2]) {
                    intersection = newIntersection;
                }
            }
        }
        return intersection;
    }
}

export default Light;