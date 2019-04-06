import Filler from "./filler";

class Matrix<T> {
    public matrix: T[][];
    public width: number;
    public height: number;

    constructor(width: number, height: number, filler?: Filler<T>) {
        this.matrix = [];
        this.width = width;
        this.height = height;

        this.fillMatrix(filler);
    }

    public static fromArray<T>(arr: T[][]) {
        const mat = new Matrix<T>(arr[0].length, arr.length);
        mat.matrix = arr;
        return mat;
    }

    public forEach(cb: (elm: T, x: number, y: number) => void) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                cb(this.matrix[i][j], j ,i);
            }
        }
    }

    private fillMatrix(filler?: Filler<T>) {
        if (!filler) { return; }

        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.matrix[i][j] = filler(j, i);
            }
        }
    }
}

export default Matrix;