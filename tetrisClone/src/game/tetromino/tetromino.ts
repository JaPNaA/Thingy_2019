import Cell from "../cell.js";
import Matrix from "../matrix/matrix.js";
import PlayField from "../playfield.js";
import TetrominoType from "./tetrominoType.js";
import IRotatableMatrix from "../matrix/iRotatableMatrix.js";
import TetrominoI from "./tetrominos/i.js";

abstract class Tetromino {
    public abstract type: TetrominoType;
    protected abstract matrix: IRotatableMatrix<Cell>;

    protected x: number;
    protected y: number;

    public constructor() {
        this.x = 0;
        this.y = 21;
    }

    protected setup() {
        this.x = Math.floor((PlayField.width - this.matrix.width) / 2);
    }

    public fall() {
        this.y--;
    }

    public left() {
        this.x--;
    }

    public right() {
        this.x++;
    }

    public rotate() {
        this.matrix.rotate();
    }

    /** Checks if the tetromino can fall one y down */
    public canFall(mat: Matrix<Cell>): boolean {
        return this.canBeAt(this.x, this.y - 1, mat);
    }

    public canGoLeft(mat: Matrix<Cell>): boolean {
        return this.canBeAt(this.x - 1, this.y, mat);
    }

    public canGoRight(mat: Matrix<Cell>): boolean {
        return this.canBeAt(this.x + 1, this.y, mat);
    }

    /** Checks if the tetromino can be at the specified position */
    private canBeAt(thisX: number, thisY: number, mat: Matrix<Cell>): boolean {
        for (let i = 0; i < this.matrix.width; i++) {
            for (let j = 0; j < this.matrix.height; j++) {
                const thisCell = this.matrix.matrix[i][j];
                const y = thisY - i;
                const x = j + thisX;
                const matCell = mat.matrix[y] && mat.matrix[y][x];

                if (matCell) {
                    if (matCell.isOccupied() && thisCell.isOccupied()) {
                        return false;
                    }
                } else {
                    if (thisCell.isOccupied()) {
                        return false;
                    }
                }

            }
        }

        return true;
    }

    public isIn(x: number, y: number): boolean {
        const row = this.matrix.matrix[this.y - y];
        if (!row) { return false; }
        const cell = row[x - this.x];
        if (!cell) { return false; }

        return cell.isOccupied();
    }

    public placeOn(mat: Matrix<Cell>): void {
        this.matrix.forEach((elm, x_, y_) => {
            const y = this.y - y_;
            const x = x_ + this.x;

            if (
                elm.isOccupied() &&
                mat.matrix[y] && mat.matrix[y][x]
            ) {
                mat.matrix[y][x].block = elm.block;
            }
        });
    }
}

export default Tetromino;