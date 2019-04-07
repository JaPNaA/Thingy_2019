import Tetromino from "../tetromino/tetrominoType.js";
import TetrominoType from "../tetromino/tetrominoType.js";

class Cell {
    public block?: Tetromino;

    public constructor() {
        // this.block = TetrominoType.z;
    }

    public static copy(cell: Cell): Cell {
        const newCell = new Cell();
        newCell.block = cell.block;
        return cell;
    }

    public isOccupied(): boolean {
        return this.block !== undefined;
    }
}

export default Cell;