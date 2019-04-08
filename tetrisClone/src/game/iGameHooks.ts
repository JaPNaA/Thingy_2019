import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playField/playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import GamePhysics from "./gamePhysics.js";
import GameLogic from "./gameLogic.js";

export default interface IGameHooks {
    newTetromino(): void;
    switchTetromino(tetromino: Tetromino): void;
    getTetromino(): Tetromino | undefined;
    getPlayField(): PlayField;
    getGenerator(): TetrominoGenerator;
    getPhysics(): GamePhysics;
    getLogic(): GameLogic;
}