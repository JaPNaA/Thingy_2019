import * as tf from "@tensorflow/tfjs";
import BirdTrainer from "./trainer/birdTrainer";

/**
 * @typedef {import("./game/game").default} Game
 */

const canvas = document.createElement("canvas");
const X = canvas.getContext("2d");
const importTextarea = document.createElement("textarea");
const importButton = document.createElement("button");
const exportButton = document.createElement("button");
const toggleSlowMode = document.createElement("button");

canvas.width = 480;
canvas.height = 480;
importTextarea.placeholder = "Import a model...";
importButton.innerText = "Import";
exportButton.innerText = "Export";
toggleSlowMode.innerText = "Toggle slow mode";
tf.setBackend("cpu");

/** @type {Game} */
let game = null;
let slowMode = false;
const trainer = new BirdTrainer(canvas.width, canvas.height);

for (let i = 0; i < 12; i++) {
    setInterval(() => {
        if (!game || slowMode) { return; }
        game.tick();
        trainer.tick();
    }, 1);
}

function reqnaf() {
    if (game) {
        game.draw(X);
        if (slowMode) {
            game.tick();
            trainer.tick();
        }
    }
    requestAnimationFrame(reqnaf);
}
reqnaf();

importButton.addEventListener("click", function () {
    try {
        trainer.importModel(importTextarea.value);
    } catch (e) {
        importTextarea.value = "Invalid!";
    }
});

exportButton.addEventListener("click", async function () {
    importTextarea.value = await trainer.serialize();
});

toggleSlowMode.addEventListener("click", function () {
    slowMode = !slowMode;
});

trainer.onNewGame((newGame) => { game = newGame; console.log(tf.memory()); });
trainer.startTraining();

document.body.appendChild(canvas);
document.body.appendChild(importTextarea);
document.body.appendChild(importButton);
document.body.appendChild(exportButton);
document.body.appendChild(toggleSlowMode);