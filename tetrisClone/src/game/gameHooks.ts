import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playField/playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import IGameHooks from "./iGameHooks.js";
import _null from "../utils/_null.js";
import GamePhysics from "./gamePhysics.js";

class GameHooks implements IGameHooks {
    private tetromino?: Tetromino;
    private playField: PlayField = _null;
    private tetrominoGenerator: TetrominoGenerator = _null;
    private newTetrominoFunc: Function = _null;
    private physics: GamePhysics = _null;

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

    public setPhysics(physics: GamePhysics): void {
        this.physics = physics;
    }

    public getPhysics(): GamePhysics {
        return this.physics;
    }
}

export default GameHooks;