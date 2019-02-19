import Obj from "./object.js";
import { dist } from "../../utils.js";

/**
 * @typedef {import("../../main").default} Main
 * @typedef {import("../quadTree/quadTree").default} QuadTree
 */

class Ball extends Obj {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {Main} main
   */
  constructor(x, y, radius, main) {
    super();

    this.main = main;

    this.x = x;
    this.y = y;
    this.vx = 0.1;
    this.vy = 0.1;

    this.radius = radius;

    this.touching = false;
    this.tickTouching = false;
  }

  /**
   * @param {CanvasRenderingContext2D} X
   */
  draw(X) {
    if (this.touching) {
      X.fillStyle = "#f00";
    } else {
      X.fillStyle = "#fff";
    }

    X.beginPath();
    X.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    X.fill();
  }

  tick() {
    this.x += this.vx;
    this.y += this.vy;

    this.touching = this.tickTouching;
    this.tickTouching = false;

    this.bounceWalls();
  }

  bounceWalls() {
    if (this.x > this.main.width) {
      this.x = this.main.width;
      this.vx = -Math.abs(this.vx);
    } else if (this.x < 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
    }

    if (this.y > this.main.height) {
      this.y = this.main.height;
      this.vy = -Math.abs(this.vy);
    } else if (this.y < 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
    }
  }

  /**
   * @param {QuadTree} quadTree 
   */
  getCollidingObjs(quadTree) {
    const radius2 = this.radius * 2;
    return quadTree.getAllIn(this.x - this.radius, this.y - this.radius, radius2, radius2);
  }

  /**
   * @param {Obj} obj 
   */
  collideWith(obj) {
    if (!this.isColliding(obj)) return;

    /** @type {Ball} */
    // @ts-ignore
    const ball = obj;

    ball.tickTouching = true;
    this.tickTouching = true;
  }

  /**
   * @param {Obj} obj
   * @returns {Boolean}
   */
  isColliding(obj) {
    return obj instanceof Ball &&
      obj.radius + this.radius > dist(obj, this);
  }
}

export default Ball;