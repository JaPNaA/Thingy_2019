import Tetromino from "./tetromino/tetromino.js";
import PlayField from "./playField/playfield.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import IGameHooks from "./iGameHooks.js";
import _null from "../utils/anyNull.js";
import GamePhysics from "./gamePhysics.js";
import GameHold from "./gameHold.js";
import GameScoring from "./gameScoring.js";

class GameHooks implements IGameHooks {
    private newTetrominoFunc: Function = _null;
    private switchTetrominoFunc: Function = _null;
    private tetromino?: Tetromino;
    private playField: PlayField = _null;
    private tetrominoGenerator: TetrominoGenerator = _null;
    private physics: GamePhysics = _null;
    private hold: GameHold = _null;
    private scoring: GameScoring = _null;

    public setNewTetromino(func: Function): void {
        this.newTetrominoFunc = func;
    }

    public newTetromino(): void {
        this.newTetrominoFunc();
    }

    public setSwitchTetromino(func: Function): void {
        this.switchTetrominoFunc = func;
    }

    public switchTetromino(tetromion: Tetromino): void {
        this.switchTetrominoFunc(tetromion);
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

    public setHold(hold: GameHold): void {
        this.hold = hold;
    }

    public getHold(): GameHold {
        return this.hold;
    }

    public setScoring(scoring: GameScoring) {
        this.scoring = scoring;
    }

    public getScoring(): GameScoring {
        return this.scoring;
    }
}

export default GameHooks;