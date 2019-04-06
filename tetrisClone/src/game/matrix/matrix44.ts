import Matrix from "./matrix.js";
import Filler from "./filler.js";
import IRotatableMatrix from "./iRotatableMatrix.js";
import copy2dArr from "../../utils/copy2dArr.js";

class Matrix44<T> extends Matrix<T> implements IRotatableMatrix<T> {
    public width: 4 = 4;
    public height: 4 = 4;

    constructor(filler?: Filler<T>) {
        super(4, 4, filler);
    }

    public static fromArray<T>(arr: T[][]): Matrix44<T> {
        const mat = new Matrix44<T>();
        mat.matrix = arr;
        return mat;
    }

    public rotate(): void {
        const copy = copy2dArr(this.matrix, this.width, this.height);

        this.matrix[0][0] = copy[3][0];
        this.matrix[0][1] = copy[2][0];
        this.matrix[0][2] = copy[1][0];
        this.matrix[0][3] = copy[0][0];

        this.matrix[1][0] = copy[3][1];
        this.matrix[1][1] = copy[2][1];
        this.matrix[1][2] = copy[1][1];
        this.matrix[1][3] = copy[0][1];

        this.matrix[2][0] = copy[3][2];
        this.matrix[2][1] = copy[2][2];
        this.matrix[2][2] = copy[1][2];
        this.matrix[2][3] = copy[0][2];

        this.matrix[3][0] = copy[3][3];
        this.matrix[3][1] = copy[2][3];
        this.matrix[3][2] = copy[1][3];
        this.matrix[3][3] = copy[0][3];
    }
}

export default Matrix44;