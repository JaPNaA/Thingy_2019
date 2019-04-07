import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";

export default interface IGameHooks {
    getTetromino(): Tetromino | undefined;
    newTetromino(): void;
    getPlayField(): PlayField;
    getGenerator(): TetrominoGenerator;
}