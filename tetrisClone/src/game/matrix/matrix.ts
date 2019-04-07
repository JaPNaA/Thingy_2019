import Filler from "./filler";

class Matrix<T> {
    public matrix: T[][];
    public width: number;
    public height: number;
    private filler?: Filler<T>

    constructor(width: number, height: number, filler?: Filler<T>) {
        this.matrix = [];
        this.width = width;
        this.height = height;

        this.filler = filler;
        this.fillMatrix();
    }

    public static fromArray<T>(arr: T[][]) {
        const mat = new Matrix<T>(arr[0].length, arr.length);
        mat.matrix = arr;
        return mat;
    }

    public forEach(cb: (elm: T, x: number, y: number) => void) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                cb(this.matrix[i][j], j, i);
            }
        }
    }

    public createRow(i: number): T[] {
        if (!this.filler) { throw new Error("No filler specified"); }

        const arr = [];
        for (let j = 0; j < this.width; j++) {
            arr[j] = this.filler(j, i);
        }
        return arr;
    }

    private fillMatrix() {
        if (!this.filler) { return; }

        for (let i = 0; i < this.height; i++) {
            this.matrix[i] = this.createRow(i);
        }
    }
}

export default Matrix;