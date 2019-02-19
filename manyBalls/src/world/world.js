import Ball from "./objects/ball.js";
import createQTree from "./quadTree/main.js";

/**
 * @typedef {import("../main").default} Main
 * @typedef {import("../world/objects/object").default} Obj
 */

class World {
  /**
   * @param {Main} main 
   */
  constructor(main) {
    this.main = main;

    /** @type {Obj[]} */
    this.objects = [];
    this.quadTree = createQTree(main.width, main.height);

    this.startReqanf();
    this.placeRandomObjects();
  }

  startReqanf() {
    requestAnimationFrame(this.reqanf.bind(this));
  }

  reqanf() {
    this.main.resize();

    this.main.context.fillStyle = "#000";
    this.main.context.fillRect(0, 0, this.main.width, this.main.height);
    for (const obj of this.objects) {
      this.quadTree.remove_nc(obj);
      obj.draw(this.main.context);
      obj.tick();

      const collideObjs = obj.getCollidingObjs(this.quadTree);
      for (const collideObj of collideObjs) {
        this.quadTree.remove_nc(collideObj);
        obj.collideWith(collideObj);
        this.quadTree.add_nc(collideObj);
      }

      this.quadTree.add_nc(obj);
    }

    this.quadTree.update();
    this.quadTree.drawDebugGrid(this.main.context);

    this.startReqanf();
  }

  placeRandomObjects() {
    for (let i = 0; i < 1000; i++) {
      const ball = new Ball(
        randInCurve(this.main.width),
        randInCurve(this.main.height),
        0.2,
        this.main
      );
      this.objects.push(ball);
      this.quadTree.add(ball);
    }
  }
}

/**
 * @param {number} m max
 * @returns {number} random number
 */
function randInCurve(m) {
  const t = Math.random();
  return t * m;
}

export default World;