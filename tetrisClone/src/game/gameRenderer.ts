import IGameHooks from "./iGameHooks.js";
import Canvas from "../engine/canvas.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import TetrominoColorMap from "./tetromino/tetrominoColorMap.js";

class GameRenderer {
    private game: IGameHooks;
    private holdTetromino?: Tetromino;

    constructor(game: IGameHooks) {
        this.game = game;
    }

    public render(canvas: Canvas) {
        const playfield = this.game.getPlayField();
        playfield.renderTo(8, 8, canvas);

        this.renderHold(canvas);
    }

    public renderHold(canvas: Canvas) {
        const hold = this.game.getLogic().getHold();

        if (hold === undefined) { return; }

        if (!this.holdTetromino || hold !== this.holdTetromino.type) {
            this.holdTetromino = new tetrominoClassMap[hold](this.game);
        }

        this.renderTetromino(this.holdTetromino, canvas);
    }

    private renderTetromino(tetromino: Tetromino, canvas: Canvas) {
        const X = canvas.getX();

        tetromino.matrix.forEach((elm, x, y) => {
            X.fillStyle = TetrominoColorMap[tetromino.type];

            if (elm.isOccupied()) {
                X.fillRect(x * 24 + 500, y * 24 + 500, 24, 24);
            }
        });
    }
}

export default GameRenderer;