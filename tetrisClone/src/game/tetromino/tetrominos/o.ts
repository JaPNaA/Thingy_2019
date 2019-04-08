import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix22 from "../../matrix/matrix22.js";
import TetrominoType from "../tetrominoType.js";
import IGameHooks from "../../iGameHooks.js";

class TetrominoO extends Tetromino {
    private static layout = strArrToLayout([
        "##",
        "##"
    ], TetrominoType.o);
    public type: TetrominoType = TetrominoType.o;

    public matrix: Matrix22<Cell>;

    public constructor(game: IGameHooks) {
        super(game);
        this.matrix = new Matrix22(
            (x, y) => Cell.copy(TetrominoO.layout[y][x])
        );

        this.setup();
    }

    // o doesn't need to be tested
    public ifCanRotateCW(): boolean {
        this.rotateCW();
        return true;
    }
}

export default TetrominoO;