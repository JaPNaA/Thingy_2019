import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix33 from "../../matrix/matrix33.js";
import TetrominoType from "../tetrominoType.js";
import IGameHooks from "../../iGameHooks.js";

class TetrominoT extends Tetromino {
    private static layout = strArrToLayout([
        " # ",
        "###",
        "   "
    ], TetrominoType.t);
    public type: TetrominoType = TetrominoType.t;

    public matrix: Matrix33<Cell>;

    public constructor(game: IGameHooks) {
        super(game);
        this.matrix = new Matrix33(
            (x, y) => Cell.copy(TetrominoT.layout[y][x])
        );

        this.setup();
    }
}

export default TetrominoT;