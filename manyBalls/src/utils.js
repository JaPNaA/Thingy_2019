/**
 * @typedef { {x: number, y: number} } Point
 */

/**
 * @param {Point} a 
 * @param {Point} b 
 */
export function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}