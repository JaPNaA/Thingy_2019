import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playField/playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import GamePhysics from "./gamePhysics.js";
import GameHold from "./gameHold.js";
import GameScoring from "./gameScoring.js";

export default interface IGameHooks {
    newTetromino(): void;
    switchTetromino(tetromino: Tetromino): void;
    getTetromino(): Tetromino | undefined;
    getPlayField(): PlayField;
    getGenerator(): TetrominoGenerator;
    getPhysics(): GamePhysics;
    getHold(): GameHold;
    getScoring(): GameScoring;
}