import Tetromino from "../tetromino.js";
import Cell from "../../cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix44 from "../../matrix/matrix44.js";
import TetrominoType from "../tetrominoType.js";

class TetrominoI extends Tetromino {
    private static layout = strArrToLayout([
        "    ",
        "####",
        "    ",
        "    "
    ], TetrominoType.i);
    public type: TetrominoType = TetrominoType.i;

    public matrix: Matrix44<Cell>;

    constructor() {
        super();
        this.matrix = new Matrix44(
            (x, y) => Cell.copy(TetrominoI.layout[y][x])
        );

        this.setup();
    }
}

export default TetrominoI;