import Cell from "../cell.js";
import Matrix from "../matrix/matrix.js";
import PlayField from "../playfield.js";
import TetrominoType from "./tetrominoType.js";
import IRotatableMatrix from "../matrix/iRotatableMatrix.js";
import TetrominoI from "./tetrominos/i.js";

abstract class Tetromino {
    public abstract matrix: IRotatableMatrix<Cell>;
    public abstract type: TetrominoType;

    protected x: number;
    protected y: number;

    constructor() {
        this.x = 0;
        this.y = 21;
    }

    protected setup() {
        this.x = Math.floor((PlayField.width - this.matrix.width) / 2);
    }

    public fall() {
        this.y--;
    }

    /** Checks if the tetromino can fall one y down */
    public canFall(mat: Matrix<Cell>): boolean {
        return this.canBeAt(this.x, this.y - 1, mat);
    }

    /** Checks if the tetromino can be at the specified position */
    private canBeAt(thisX: number, thisY: number, mat: Matrix<Cell>): boolean {
        for (let i = 0; i < this.matrix.width; i++) {
            for (let j = 0; j < this.matrix.height; j++) {
                const thisElm = this.matrix.matrix[i][j];
                const y = thisY - i;
                const x = j + thisX;
                const matElm = mat.matrix[y] && mat.matrix[y][x];
                if (!matElm) { return false; }

                if (thisElm.isOccupied() && matElm.isOccupied()) {
                    return false;
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