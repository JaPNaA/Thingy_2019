import Cell from "./cell.js";
import Canvas from "../engine/canvas.js";
import Matrix from "./matrix/matrix.js";
import TetrominoColorMap from "./tetromino/tetrominoColorMap.js";
import Tetromino from "./tetromino/tetromino.js";
import TetrominoI from "./tetromino/tetrominos/i.js";
import TetrominoType from "./tetromino/tetrominoType.js";

class PlayField {
    public static width = 10;
    public static height = 20;
    public field: Matrix<Cell>;

    private static vanishHeight = 2;

    private scale: number = 24;
    private tetromino?: Tetromino;

    public constructor() {
        this.field = new Matrix(
            PlayField.width,
            PlayField.height + PlayField.vanishHeight,
            () => new Cell()
        );
    }

    public setTetromino(tetromino?: Tetromino): void {
        this.tetromino = tetromino;
    }

    public renderTo(canvas: Canvas) {
        const X = canvas.getX();

        X.strokeStyle = "#888888";
        X.clearRect(0, 0, PlayField.width * this.scale, PlayField.height * this.scale);

        this.field.forEach((cell, x, y) => {
            // if (y < PlayField.vanishHeight - 1) { return; }
            if (cell.isOccupied()) {
                X.fillStyle = TetrominoColorMap[cell.block as TetrominoType];
            } else if (this.tetromino && this.tetromino.isIn(x, y)) {
                X.fillStyle = TetrominoColorMap[this.tetromino.type];
            } else {
                return;
            }

            X.beginPath();
            X.rect(
                x * this.scale,
                (PlayField.height - y) * this.scale,
                this.scale,
                this.scale
            );

            X.fill();
            X.stroke();
        });
    }
}

export default PlayField;