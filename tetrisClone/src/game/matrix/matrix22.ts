import Matrix from "./matrix.js";
import Filler from "./filler.js";
import IRotatableMatrix from "./iRotatableMatrix.js";
import copy2dArr from "../../utils/copy2dArr.js";

class Matrix22<T> extends Matrix<T> implements IRotatableMatrix<T> {
    public width: 2 = 2;
    public height: 2 = 2;

    constructor(filler?: Filler<T>) {
        super(2, 2, filler);
    }

    public static fromArray<T>(arr: T[][]): Matrix22<T> {
        const mat = new Matrix22<T>();
        mat.matrix = arr;
        return mat;
    }

    public rotate(): void {
        const copy = copy2dArr(this.matrix, this.width, this.height);

        this.matrix[0][0] = copy[1][0];
        this.matrix[0][1] = copy[0][0];
        this.matrix[1][0] = copy[1][1];
        this.matrix[1][1] = copy[0][1];
    }
}

export default Matrix22;