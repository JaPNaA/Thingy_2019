import Tetromino from "../tetromino.js";
import Cell from "../../playField/cell.js";
import strArrToLayout from "../../../utils/strArrToLayout.js";
import Matrix44 from "../../matrix/matrix44.js";
import TetrominoType from "../tetrominoType.js";
import IMatrix from "../../matrix/iMatrix.js";
import copy2dArr from "../../../utils/copy2dArr.js";
import RotationState from "../tetrominoRotationState.js";
import IGameHooks from "../../iGameHooks.js";

class TetrominoI extends Tetromino {
    private static layout = strArrToLayout([
        "    ",
        "####",
        "    ",
        "    "
    ], TetrominoType.i);

    private static iwallKickDataCW: { [x: number]: [number, number][] } = {
        [RotationState.up]: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        [RotationState.right]: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        [RotationState.down]: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        [RotationState.left]: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
    };

    public type: TetrominoType = TetrominoType.i;

    public matrix: Matrix44<Cell>;

    public constructor(game: IGameHooks) {
        super(game);
        this.y = 20;
        this.matrix = new Matrix44(
            (x, y) => Cell.copy(TetrominoI.layout[y][x])
        );

        this.setup();
    }

    public ifCanRotateCW(mat: IMatrix<Cell>): boolean {
        const thisMat = Matrix44.fromArray(copy2dArr(
            this.matrix.matrix,
            this.matrix.width,
            this.matrix.height
        ));

        thisMat.rotate();

        // using SRS
        const tests = TetrominoI.iwallKickDataCW[this.rotationState];
        for (const test of tests) {
            if (this.canBeAt(this.x + test[0], this.y + test[1], thisMat, mat)) {
                this.rotateCW();
                this.x += test[0];
                this.y += test[1];
                return true;
            }
        }

        return false;
    }
}

export default TetrominoI;