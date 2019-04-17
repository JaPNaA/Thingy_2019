import TetrominoColorMap from "../game/tetromino/tetrominoColorMap.js";
export default function renderTetromino(tetromino, canvas, scale, startX, startY, width, height) {
    var X = canvas.getX();
    X.fillStyle = "#000000";
    X.fillRect(startX, startY, scale * width, scale * height);
    X.strokeStyle = "#888888";
    X.fillStyle = TetrominoColorMap[tetromino.type];
    tetromino.matrix.forEach(function (elm, x, y) {
        if (elm.isOccupied()) {
            X.beginPath();
            X.rect(x * scale + startX, y * scale + startY, scale, scale);
            X.fill();
            X.stroke();
        }
    });
}
