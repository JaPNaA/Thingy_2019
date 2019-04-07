import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playField/playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import GamePhysics from "./gamePhysics.js";

export default interface IGameHooks {
    getTetromino(): Tetromino | undefined;
    newTetromino(): void;
    getPlayField(): PlayField;
    getGenerator(): TetrominoGenerator;
    getPhysics(): GamePhysics;
}