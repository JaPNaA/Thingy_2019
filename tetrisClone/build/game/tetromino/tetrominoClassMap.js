var _a;
import TetrominoI from "./tetrominos/i.js";
import TetrominoJ from "./tetrominos/j.js";
import TetrominoL from "./tetrominos/l.js";
import TetrominoO from "./tetrominos/o.js";
import TetrominoS from "./tetrominos/s.js";
import TetrominoT from "./tetrominos/t.js";
import TetrominoZ from "./tetrominos/z.js";
import Tetromino from "./tetrominoType.js";
var tetrominoClassMap = (_a = {},
    _a[Tetromino.j] = TetrominoJ,
    _a[Tetromino.i] = TetrominoI,
    _a[Tetromino.s] = TetrominoS,
    _a[Tetromino.l] = TetrominoL,
    _a[Tetromino.t] = TetrominoT,
    _a[Tetromino.z] = TetrominoZ,
    _a[Tetromino.o] = TetrominoO,
    _a);
console.log(tetrominoClassMap);
export default tetrominoClassMap;
