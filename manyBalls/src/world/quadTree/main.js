import QuadTree from "./quadTree.js";

/**
 * @param {number} width 
 * @param {number} height
 * @returns {QuadTree}
 */
export default function createQTree(width, height) {
  return new QuadTree(0, 0, width, height);
}