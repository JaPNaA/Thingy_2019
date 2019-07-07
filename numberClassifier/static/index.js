const canvas = document.createElement("canvas");
const predictButton = document.createElement("button");
const scale = 12;

canvas.width = 28;
canvas.height = 28;

canvas.style.width = scale * canvas.width + "px";
canvas.style.height = scale * canvas.height + "px";
canvas.style.position = "relative";
canvas.style.border = "1px solid black";
canvas.style.imageRendering = "pixelated"; // for chrome
canvas.style.imageRendering = "crisp-edges"; // for firefox

document.body.appendChild(canvas);

predictButton.innerHTML = "Predict!";
predictButton.style.display = "block";
document.body.appendChild(predictButton);

const X = canvas.getContext("2d");

let mouseDown = false;
let lastPointX = undefined;
let lastPointY = undefined;
const lineWidth = 2;

addEventListener("mousedown", e => {
    mouseDown = true;
    const x = e.layerX / scale;
    const y = e.layerY / scale;
    lastPointX = x;
    lastPointY = y;

    X.beginPath();
    X.fillStyle = "#000000";
    X.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    X.fill();
});
addEventListener("mouseup", () => {
    mouseDown = false;
    lastPointX = undefined;
    lastPointY = undefined;
});
addEventListener("mousemove", function (e) {
    if (!mouseDown) { return; }

    const x = e.layerX / scale;
    const y = e.layerY / scale;

    if (lastPointX && lastPointY) {
        X.strokeStyle = "#000000";
        X.beginPath();
        X.lineWidth = lineWidth;
        X.moveTo(lastPointX, lastPointY);
        X.lineTo(x, y);
        X.stroke();
    }

    lastPointX = x;
    lastPointY = y;
});

predictButton.addEventListener("click", function () {
    const arr = [];
    const imageData = X.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        const yOff = y * canvas.width;

        for (let x = 0; x < canvas.width; x++) {
            arr.push(imageData.data[(yOff + x) * 4 + 3]);
        }
    }

    fetch("/", {
        body: arr.join(","),
        headers: {
            "Content-Type": "text/plain"
        },
        method: "POST"
    })
        .then(e => e.text())
        .then(e => {
            console.log(e);
        });
});