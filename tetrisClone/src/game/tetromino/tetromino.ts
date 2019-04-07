import Cell from "../cell.js";
import PlayField from "../playfield.js";
import TetrominoType from "./tetrominoType.js";
import IRotatableMatrix from "../matrix/iRotatableMatrix.js";
import RotationState from "./tetrominoRotationState.js";
import IMatrix from "../matrix/iMatrix.js";
import Matrix33 from "../matrix/matrix33.js";
import copy2dArr from "../../utils/copy2dArr.js";

abstract class Tetromino {
    public abstract type: TetrominoType;
    protected abstract matrix: IRotatableMatrix<Cell>;

    private static wallKickDataCW: { [x: number]: [number, number][] } = {
        [RotationState.up]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        [RotationState.right]: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        [RotationState.down]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [RotationState.left]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
    };

    protected x: number;
    protected y: number;

    protected rotationState: RotationState;

    public constructor() {
        this.x = 0;
        this.y = 20;
        this.rotationState = RotationState.up;
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

    public rotateCW() {
        this.matrix.rotate();
        this.rotationState = (this.rotationState + 1) % 4;
    }

    public isIn(x: number, y: number): boolean {
        const row = this.matrix.matrix[this.y - y];
        if (!row) { return false; }
        const cell = row[x - this.x];
        if (!cell) { return false; }

        return cell.isOccupied();
    }

    public placeOn(mat: IMatrix<Cell>): void {
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

    /** Checks if the tetromino can fall one y down */
    public canFall(mat: IMatrix<Cell>): boolean {
        return this.canBeAt(this.x, this.y - 1, this.matrix, mat);
    }

    public canGoLeft(mat: IMatrix<Cell>): boolean {
        return this.canBeAt(this.x - 1, this.y, this.matrix, mat);
    }

    public canGoRight(mat: IMatrix<Cell>): boolean {
        return this.canBeAt(this.x + 1, this.y, this.matrix, mat);
    }

    public ifCanRotateCW(mat: IMatrix<Cell>): boolean {
        const thisMat = Matrix33.fromArray(copy2dArr(
            this.matrix.matrix,
            this.matrix.width,
            this.matrix.height
        ));

        thisMat.rotate();

        // using SRS
        const tests = Tetromino.wallKickDataCW[this.rotationState];
        for (const test of tests) {
            if (this.canBeAt(this.x + test[0], this.y + test[1], thisMat, mat)) {
                this.rotateCW();
                this.x += test[0];
                this.y += test[1];
                return true;
            }
        }

        return false;
    }

    public canRotateCCW(): boolean {
        return false;
    }

    public getHardDropY(mat: IMatrix<Cell>): number {
        const oldY = this.y;
        while (this.canFall(mat)) {
            this.fall();
        }
        const newY = this.y;
        this.y = oldY;
        return newY;
    }

    /** Checks if the tetromino can be at the specified position */
    protected canBeAt(thisX: number, thisY: number, thisMat: IMatrix<Cell>, mat: IMatrix<Cell>): boolean {
        for (let i = 0; i < thisMat.width; i++) {
            for (let j = 0; j < thisMat.height; j++) {
                const thisCell = thisMat.matrix[i][j];
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
}

export default Tetromino;