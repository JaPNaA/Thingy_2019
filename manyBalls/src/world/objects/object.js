/**
 * @typedef {import("../quadTree/quadTree").default} QuadTree
 */

class Obj {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  /**
   * @param {CanvasRenderingContext2D} X
   */
  draw(X) {
    throw new Error("abstract method call");
  }

  tick() {
    throw new Error("abstract method call");
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  isTouchingRect(x, y, width, height) {
    return (
      this.x >= x &&
      this.x <= x + width &&
      this.y >= y &&
      this.y <= y + height
    );
  }

  /**
   * @param {QuadTree} quadTree
   * @returns {Obj[]}
   */
  getCollidingObjs(quadTree) {
    return [];
  }

  /**
   * @param {Obj} obj 
   */
  collideWith(obj) { }
}

export default Obj;