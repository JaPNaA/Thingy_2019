import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix33 from "../../matrix/matrix33.js";
import TetrominoType from "../tetrominoType.js";
import IGameHooks from "../../iGameHooks.js";

class TetrominoL extends Tetromino {
    private static layout = strArrToLayout([
        "  #",
        "###",
        "   "
    ], TetrominoType.l);
    public type: TetrominoType = TetrominoType.l;

    public matrix: Matrix33<Cell>;

    public constructor(game: IGameHooks) {
        super(game);
        this.matrix = new Matrix33(
            (x, y) => Cell.copy(TetrominoL.layout[y][x])
        );

        this.setup();
    }
}

export default TetrominoL;