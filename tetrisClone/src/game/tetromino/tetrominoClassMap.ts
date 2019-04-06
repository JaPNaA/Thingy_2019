import TetrominoI from "./tetrominos/i.js";
import TetrominoJ from "./tetrominos/j.js";
import TetrominoL from "./tetrominos/l.js";
import TetrominoO from "./tetrominos/o.js";
import TetrominoS from "./tetrominos/s.js";
import TetrominoT from "./tetrominos/t.js";
import TetrominoZ from "./tetrominos/z.js";
import TetrominoClass from "./tetrominoClass.js";
import Tetromino from "./tetrominoType.js";

const tetrominoClassMap: { [x: number]: TetrominoClass } = {
    [Tetromino.j]: TetrominoJ,
    [Tetromino.i]: TetrominoI,
    [Tetromino.s]: TetrominoS,
    [Tetromino.l]: TetrominoL,
    [Tetromino.t]: TetrominoT,
    [Tetromino.z]: TetrominoZ,
    [Tetromino.o]: TetrominoO
};

console.log(tetrominoClassMap);

export default tetrominoClassMap;