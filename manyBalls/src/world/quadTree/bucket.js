import QuadTree from "./quadTree.js";

/**
 * @typedef {import("../objects/object").default} Obj
 */

class Bucket {
  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(x, y, width, height) {
    this.isTree = false;
    /** @type {Obj[]} */
    this.elms = [];
    /** @type {QuadTree} */
    this.tree = null;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * @returns {Obj[]}
   */
  getAll() {
    if (this.isTree) {
      return this.tree.getAll();
    } else {
      return this.elms;
    }
  }

  /**
   * @returns {number} length
   */
  getAllImmediateLength() {
    if (this.isTree) {
      return this.tree.getAllImmediateLength();
    } else {
      return this.elms.length;
    }
  }

  /**
   * @param {number} x
   * @param {number} y 
   * @param {number} width 
   * @param {number} height
   * @returns {Obj[]} 
   */
  getAllIn(x, y, width, height) {
    if (this.isTree) {
      return this.tree.getAllIn(x, y, width, height);
    } else {
      const elms = [];

      for (let elm of this.elms) {
        if (elm.isTouchingRect(x, y, width, height)) {
          elms.push(elm);
        }
      }

      return elms;
    }
  }

  /**
   * @param {Obj} obj 
   */
  add(obj) {
    if (this.isTree) {
      this.tree.add(obj);
    } else {
      this.elms.push(obj);
      this.splitIfShould();
    }
  }

  /**
   * @param {Obj} obj 
   */
  add_nc(obj) {
    if (this.isTree) {
      this.tree.add(obj);
    } else {
      this.elms.push(obj);
    }
  }

  /**
   * @param {Obj} obj 
   */
  remove(obj) {
    if (this.isTree) {
      this.tree.remove(obj);
    } else {
      const index = this.elms.indexOf(obj);
      this.elms.splice(index, 1);
    }
    this.mergeIfShould();
  }

  /**
   * @param {Obj} obj
   */
  remove_nc(obj) {
    if (this.isTree) {
      this.tree.remove(obj);
    } else {
      const index = this.elms.indexOf(obj);
      this.elms.splice(index, 1);
    }
  }

  update() {
    this.splitIfShould();
    this.mergeIfShould();
    if (this.isTree) {
      this.tree.update();
    }
  }

  splitIfShould() {
    if (this.elms.length >= Bucket.splitBreakpoint) {
      this.split();
    }
  }

  mergeIfShould() {
    if (!this.isTree) return;

    if (this.getAllImmediateLength() < Bucket.splitBreakpoint) {
      this.merge();
    }
  }

  split() {
    this.tree = new QuadTree(this.x, this.y, this.width, this.height);

    for (let elm of this.elms) {
      this.tree.add(elm);
    }

    this.elms.length = 0;
    this.isTree = true;
  }

  merge() {
    this.elms = this.tree.getAll();
    this.tree = null;
    this.isTree = false;
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  isTouchingRect(x, y, width, height) {
    return (
      this.x <= x + width &&
      this.x + this.width >= x &&
      this.y <= y + height &&
      this.height + this.y >= y
    );
  }

  /**
   * @param {CanvasRenderingContext2D} X 
   * @returns {number} depth
   */
  drawDebugGrid(X) {
    if (this.isTree) {
      return this.tree.drawDebugGrid(X);
    } else {
      X.strokeStyle = "#884444";
      X.lineWidth = 0.1;
      X.beginPath();
      X.rect(this.x, this.y, this.width, this.height);
      X.stroke();
      return 1;
    }
  }
}

Bucket.splitBreakpoint = 100;

export default Bucket;