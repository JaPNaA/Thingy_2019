import Tetromino from "../tetromino.js";
import Cell from "../../cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix33 from "../../matrix/matrix33.js";
import TetrominoType from "../tetrominoType.js";

class TetrominoZ extends Tetromino {
    private static layout = strArrToLayout([
        "## ",
        " ##",
        "   "
    ], TetrominoType.z);
    public type: TetrominoType = TetrominoType.z;

    public matrix: Matrix33<Cell>;

    constructor() {
        super();
        this.matrix = new Matrix33(
            (x, y) => Cell.copy(TetrominoZ.layout[y][x])
        );

        this.setup();
    }
}

export default TetrominoZ;