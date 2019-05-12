import World from "./world.js";
import Line from "./line.js";
import Light from "./light.js";

const canvas = document.createElement("canvas");
const X = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

document.body.appendChild(canvas);


const world = new World();
const light0 = new Light(world, 50, 100);
const light1 = new Light(world, 50, 120);
addRectangle(8, 8, 1920 - 16, 1080 - 16);
world.add(new Line(world, 8, 8, 200, 200));
world.add(new Line(world, 256, 8, 200, 200));
world.add(new Line(world, 500, 300, 400, 300));
world.add(new Line(world, 800, 300, 900, 900));
world.add(new Line(world, 500, 720, 800, 720));

addRectangle(400, 400, 400, 400);
addRectangle(1200, 500, 200, 200);

world.add(light0);
world.add(light1);
world.render(X);

let holdingLeft = false;
let holdingRight = false;

addEventListener("mousedown", function (e) {
    if (e.button === 0) { holdingLeft = true; }
    else if (e.button === 2) { holdingRight = true; }
});

addEventListener("mouseup", function (e) {
    if (e.button === 0) { holdingLeft = false; }
    else if (e.button === 2) { holdingRight = false; }
});

addEventListener("contextmenu", e => e.preventDefault());

addEventListener("mousemove", function (e) {
    if (holdingLeft) {
        light0.x = e.layerX;
        light0.y = e.layerY;
    }
    if (holdingRight) {
        light1.x = e.layerX;
        light1.y = e.layerY;
    }

    if (holdingLeft && holdingRight) {
        light1.x += 16;
    }
    world.render(X);
});


function addRectangle(x, y, width, height) {
    world.add(new Line(world, x, y, x, y + height));
    world.add(new Line(world, x, y + height, x + width, y + height));
    world.add(new Line(world, x + width, y + height, x + width, y));
    world.add(new Line(world, x + width, y, x, y));
}