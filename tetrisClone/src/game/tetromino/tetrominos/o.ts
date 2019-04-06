import Tetromino from "../tetromino.js";
import Cell from "../../cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix22 from "../../matrix/matrix22.js";
import TetrominoType from "../tetrominoType.js";

class TetrominoO extends Tetromino {
    private static layout = strArrToLayout([
        "##",
        "##"
    ], TetrominoType.o);
    public type: TetrominoType = TetrominoType.o;

    public matrix: Matrix22<Cell>;

    constructor() {
        super();
        this.matrix = new Matrix22(
            (x, y) => Cell.copy(TetrominoO.layout[y][x])
        );

        this.setup();
    }
}

export default TetrominoO;