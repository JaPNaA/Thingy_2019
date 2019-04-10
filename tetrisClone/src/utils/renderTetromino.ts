import Canvas from "../engine/canvas.js";
import Tetromino from "../game/tetromino/tetromino.js";
import TetrominoColorMap from "../game/tetromino/tetrominoColorMap.js";

export default function renderTetromino(tetromino: Tetromino, canvas: Canvas, scale: number, startX: number, startY: number, width: number, height: number) {
    const X = canvas.getX();
    X.fillStyle = "#000000";
    X.fillRect(startX, startY, scale * width, scale * height);

    X.strokeStyle = "#888888";
    X.fillStyle = TetrominoColorMap[tetromino.type];

    tetromino.matrix.forEach((elm, x, y) => {
        if (elm.isOccupied()) {
            X.beginPath();
            X.rect(
                x * scale + startX,
                y * scale + startY,
                scale,
                scale
            );
            X.fill();
            X.stroke();
        }
    });
}