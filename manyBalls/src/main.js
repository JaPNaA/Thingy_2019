import createCanvas from "./canvas.js";
import World from "./world/world.js";

class Main {
  constructor() {
    this.width = 100;
    this.height = 100;

    const { canvas, context, resize } = createCanvas(this.width, this.height);

    this.canvas = canvas;
    this.context = context;
    this.resize = resize;

    this.world = new World(this);
  }
}

const main = new Main();

console.log("load", main);

export default Main;