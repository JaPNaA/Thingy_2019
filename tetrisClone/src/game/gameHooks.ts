import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import IGameHooks from "./iGameHooks.js";
import _null from "../utils/_null.js";

class GameHooks implements IGameHooks {
    private tetromino?: Tetromino;
    private playField: PlayField = _null;
    private tetrominoGenerator: TetrominoGenerator = _null;
    private newTetrominoFunc: Function = _null;

    public setNewTetromino(func: Function): void {
        this.newTetrominoFunc = func;
    }

    public newTetromino(): void {
        this.newTetrominoFunc();
    }

    public setTetromino(tetromino?: Tetromino): void {
        this.tetromino = tetromino;
    }

    public getTetromino(): Tetromino | undefined {
        return this.tetromino;
    }

    public setPlayField(playField: PlayField): void {
        this.playField = playField;
    }

    public getPlayField(): PlayField {
        return this.playField;
    }

    public setGenerator(generator: TetrominoGenerator): void {
        this.tetrominoGenerator = generator;
    }

    public getGenerator(): TetrominoGenerator {
        return this.tetrominoGenerator;
    }
}

export default GameHooks;