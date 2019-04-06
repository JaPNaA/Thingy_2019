import Cell from "../game/cell.js";
import Tetromino from "../game/tetromino/tetrominoType.js";

export default function strArrToLayout(arr: string[], type: Tetromino): Cell[][] {
    const out: Cell[][] = [];
    const height = arr.length;
    const width = arr[0].length;

    for (let i = 0; i < height; i++) {
        out[i] = [];

        for (let j = 0; j < width; j++) {
            out[i][j] = new Cell();

            if (arr[i][j] === "#") {
                out[i][j].block = type;
            }
        }
    }

    return out;
}