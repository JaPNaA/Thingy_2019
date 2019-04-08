import Tetromino from "./tetromino/tetromino.js";
import IGameHooks from "./iGameHooks.js";
import TetrominoType from "./tetromino/tetrominoType.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";

class GameLogic {
    private holdingTetromino?: TetrominoType;
    private game: IGameHooks;

    constructor(game: IGameHooks) {
        this.game = game;
    }

    public getHold(): TetrominoType | undefined {
        return this.holdingTetromino;
    }

    public hold(): void {
        if (this.holdingTetromino !== undefined) {
            const oldHold = this.holdingTetromino;
            this.setHold(this.game.getTetromino());
            this.game.switchTetromino(new tetrominoClassMap[oldHold](this.game));
        } else {
            this.setHold(this.game.getTetromino());
            this.game.newTetromino();
        }
    }

    private setHold(tetromino?: Tetromino): void {
        this.holdingTetromino = tetromino && tetromino.type;
    }
}

export default GameLogic;