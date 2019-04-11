import Tetromino from "../tetromino/tetromino.js";
import Canvas from "../../engine/canvas.js";
import tetrominoClassMap from "../tetromino/tetrominoClassMap.js";
import IGameHooks from "../iGameHooks.js";
import TetrominoType from "../tetromino/tetrominoType.js";
import renderTetromino from "../../utils/renderTetromino.js";

class TetrominoDisplay {
    private static x: number = 8;
    private static y: number = 8;
    private static scale: number = 24;
    private static width: number = 4;
    private static height: number = 4;

    private tetromino?: Tetromino;

    private game: IGameHooks;

    public constructor(game: IGameHooks) {
        this.game = game;
    }

    public render(canvas: Canvas) {
        if (this.tetromino === undefined) { return; }

        renderTetromino(
            this.tetromino,
            canvas,
            TetrominoDisplay.scale,
            TetrominoDisplay.x,
            TetrominoDisplay.y,
            TetrominoDisplay.width,
            TetrominoDisplay.height
        );
    }

    public setTetromino(tetromino?: TetrominoType) {
        if (tetromino === undefined) {
            this.tetromino = undefined;
        } else if (this.isDifferentFrom(tetromino)) {
            this.tetromino = new tetrominoClassMap[tetromino](this.game);
        }
    }

    private isDifferentFrom(tetromino: TetrominoType) {
        return this.tetromino === undefined || tetromino !== this.tetromino.type;
    }
}

export default TetrominoDisplay;