import Bucket from "./bucket.js";
/**
 * @typedef {import("../objects/object").default} Obj
 */

class QuadTree {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x, y, width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.middleX = x + halfWidth;
    this.middleY = y + halfHeight;

    this.topleft = new Bucket(this.x, this.y, halfWidth, halfHeight);
    this.topright = new Bucket(this.middleX, this.y, halfWidth, halfHeight);
    this.bottomleft = new Bucket(this.x, this.middleY, halfWidth, halfHeight);
    this.bottomright = new Bucket(this.middleX, this.middleY, halfWidth, halfHeight);
  }

  /**
   * @param {Obj} obj
   */
  add(obj) {
    if (obj.y < this.middleY) {
      if (obj.x < this.middleX) {
        this.topleft.add(obj);
      } else {
        this.topright.add(obj);
      }
    } else {
      if (obj.x < this.middleX) {
        this.bottomleft.add(obj);
      } else {
        this.bottomright.add(obj);
      }
    }
  }

  /**
   * @param {Obj} obj 
   */
  remove(obj) {
    if (obj.y < this.middleY) {
      if (obj.x < this.middleX) {
        this.topleft.remove(obj);
      } else {
        this.topright.remove(obj);
      }
    } else {
      if (obj.x < this.middleX) {
        this.bottomleft.remove(obj);
      } else {
        this.bottomright.remove(obj);
      }
    }
  }

  /**
   * @param {Obj} obj
   */
  add_nc(obj) {
    if (obj.y < this.middleY) {
      if (obj.x < this.middleX) {
        this.topleft.add_nc(obj);
      } else {
        this.topright.add_nc(obj);
      }
    } else {
      if (obj.x < this.middleX) {
        this.bottomleft.add_nc(obj);
      } else {
        this.bottomright.add_nc(obj);
      }
    }
  }

  /**
   * @param {Obj} obj 
   */
  remove_nc(obj) {
    if (obj.y < this.middleY) {
      if (obj.x < this.middleX) {
        this.topleft.remove_nc(obj);
      } else {
        this.topright.remove_nc(obj);
      }
    } else {
      if (obj.x < this.middleX) {
        this.bottomleft.remove_nc(obj);
      } else {
        this.bottomright.remove_nc(obj);
      }
    }
  }

  update() {
    this.topleft.update();
    this.topright.update();
    this.bottomleft.update();
    this.bottomright.update();
  }

  /**
   * @returns {Obj[]}
   */
  getAll() {
    return [
      ...this.topleft.getAll(),
      ...this.topright.getAll(),
      ...this.bottomleft.getAll(),
      ...this.bottomright.getAll()
    ];
  }

  getAllImmediateLength() {
    return this.topleft.elms.length +
      this.topright.elms.length +
      this.bottomleft.elms.length +
      this.bottomright.elms.length;
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @returns {Obj[]}
   */
  getAllIn(x, y, width, height) {
    const arr = [];

    if (this.topleft.isTouchingRect(x, y, width, height)) {
      arr.push(...this.topleft.getAllIn(x, y, width, height));
    }
    if (this.topright.isTouchingRect(x, y, width, height)) {
      arr.push(...this.topright.getAllIn(x, y, width, height));
    }
    if (this.bottomleft.isTouchingRect(x, y, width, height)) {
      arr.push(...this.bottomleft.getAllIn(x, y, width, height));
    }
    if (this.bottomright.isTouchingRect(x, y, width, height)) {
      arr.push(...this.bottomright.getAllIn(x, y, width, height));
    }

    return arr;
  }

  /**
   * @param {CanvasRenderingContext2D} X
   * @returns {number} depth
   */
  drawDebugGrid(X) {
    return Math.max(
      this.topleft.drawDebugGrid(X),
      this.topright.drawDebugGrid(X),
      this.bottomleft.drawDebugGrid(X),
      this.bottomright.drawDebugGrid(X)
    ) + 1;
  }
}

export default QuadTree;