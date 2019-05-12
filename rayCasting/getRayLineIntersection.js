/**
 * Gets the point where two lines intersect
 * @param {number} x0 ray start x
 * @param {number} y0 ray start y
 * @param {number} x1 ray direction x
 * @param {number} y1 ray direction y
 * @param {number} x2 line start x
 * @param {number} y2 line start y
 * @param {number} x3 line end x
 * @param {number} y3 line end y
 * @returns {[number, number, number] | null} point of intersection, [x, y, dist]
 */
export default function getLineRayIntersection(x0, y0, x1, y1, x2, y2, x3, y3) {
    const dx0 = x1 - x0;
    const dy0 = y1 - y0;
    const dx1 = x3 - x2;
    const dy1 = y3 - y2;
    const s0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    const s1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (dx0 / s0 === dx1 / s1 && dy0 / s0 === dy1 / s1) { return null; }
    const t2 = (dx0 * (y2 - y0) + dy0 * (x0 - x2)) / (dx1 * dy0 - dy1 * dx0);
    const t1 = (x2 + dx1 * t2 - x0) / dx0;
    if (t1 < 0 || t2 < 0 || t2 > 1) return null;
    return [
        x0 + dx0 * t1,
        y0 + dy0 * t1,
        t1
    ];
}
