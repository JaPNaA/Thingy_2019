import Tetromino from "./tetromino/tetromino.js";
import IGameHooks from "./iGameHooks.js";
import TetrominoType from "./tetromino/tetrominoType.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";

class GameHold {
    private holdingTetromino?: TetrominoType;
    private game: IGameHooks;
    private held: boolean;

    constructor(game: IGameHooks) {
        this.game = game;
        this.held = false;
    }

    public getHold(): TetrominoType | undefined {
        return this.holdingTetromino;
    }

    public onNewTetromino(): void {
        this.held = false;
    }

    public hold(): void {
        if (this.held) { return; }

        if (this.holdingTetromino !== undefined) {
            const oldHold = this.holdingTetromino;
            this.setHold(this.game.getTetromino());
            this.game.switchTetromino(new tetrominoClassMap[oldHold](this.game));
        } else {
            this.setHold(this.game.getTetromino());
            this.game.newTetromino();
        }

        this.held = true;
    }

    private setHold(tetromino?: Tetromino): void {
        this.holdingTetromino = tetromino && tetromino.type;
    }
}

export default GameHold;