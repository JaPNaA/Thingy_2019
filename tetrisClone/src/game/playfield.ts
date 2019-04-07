import Cell from "./cell.js";
import Canvas from "../engine/canvas.js";
import Matrix from "./matrix/matrix.js";
import TetrominoColorMap from "./tetromino/tetrominoColorMap.js";
import TetrominoType from "./tetromino/tetrominoType.js";
import IGameHooks from "./iGameHooks.js";
import Tetromino from "./tetromino/tetromino.js";

class PlayField {
    public static width = 10;
    public static height = 20;
    public field: Matrix<Cell>;

    private static vanishHeight = 2;

    private game: IGameHooks;
    private scale: number = 24;

    public constructor(game: IGameHooks) {
        this.game = game;

        this.field = new Matrix(
            PlayField.width,
            PlayField.height + PlayField.vanishHeight,
            () => new Cell()
        );
    }

    public renderTo(canvas: Canvas) {
        const X = canvas.getX();
        const fallingTetromino = this.game.getTetromino();
        const ghostTetrominoDist = this.getGhostTetrominoDist(fallingTetromino);

        X.fillStyle = "#000000";
        X.fillRect(0, 0, PlayField.width * this.scale, PlayField.height * this.scale);
        X.strokeStyle = "#888888";

        this.field.forEach((cell, x, y) => {
            if (y >= PlayField.height) { return; }

            if (cell.isOccupied()) {
                X.fillStyle = TetrominoColorMap[cell.block as TetrominoType];
            } else if (fallingTetromino) {
                if (fallingTetromino.isIn(x, y)) {
                    X.fillStyle = TetrominoColorMap[fallingTetromino.type];
                } else if (fallingTetromino.isIn(x, y + ghostTetrominoDist)) {
                    X.fillStyle = "#888888";
                } else {
                    return;
                }
            } else {
                return;
            }

            X.beginPath();
            X.rect(
                x * this.scale,
                (PlayField.height - y - 1) * this.scale,
                this.scale,
                this.scale
            );

            X.fill();
            X.stroke();
        });
    }

    public update() {
        rowsLoop: for (let i = this.field.height - 1; i >= 0; i--) {
            const row = this.field.matrix[i];

            for (let j = 0; j < this.field.width; j++) {
                if (!row[j].isOccupied()) {
                    continue rowsLoop;
                }
            }

            this.clearLine(i);
        }
    }

    private clearLine(index: number) {
        this.field.matrix.splice(index, 1);
        this.field.matrix.push(this.field.createRow(this.field.height - 1));
    }

    private getGhostTetrominoDist(fallingTetromino?: Tetromino): number {
        if (!fallingTetromino) { return 0; }
        return fallingTetromino.getY() - fallingTetromino.getHardDropY(this.field);
    }
}

export default PlayField;