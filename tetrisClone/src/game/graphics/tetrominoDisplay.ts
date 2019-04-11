import Tetromino from "../tetromino/tetromino.js";
import Canvas from "../../engine/canvas.js";
import tetrominoClassMap from "../tetromino/tetrominoClassMap.js";
import IGameHooks from "../iGameHooks.js";
import TetrominoType from "../tetromino/tetrominoType.js";
import renderTetromino from "../../utils/renderTetromino.js";

class TetrominoDisplay {
    private static defaultX: number = 8;
    private static defaultY: number = 8;
    private static defaultScale: number = 24;
    private static defaultWidth: number = 4;
    private static defaultHeight: number = 4;

    private tetromino?: Tetromino;

    private game: IGameHooks;
    private x: number;
    private y: number;
    private scale: number;
    private width: number;
    private height: number;

    public constructor(game: IGameHooks, options: {
        x?: number,
        y?: number,
        scale?: number,
        width?: number,
        height?: number
    } = {}) {
        this.game = game;
        this.x = options.x || TetrominoDisplay.defaultX;
        this.y = options.y || TetrominoDisplay.defaultY;
        this.scale = options.scale || TetrominoDisplay.defaultScale;
        this.width = options.width || TetrominoDisplay.defaultWidth;
        this.height = options.height || TetrominoDisplay.defaultHeight;
    }

    public render(canvas: Canvas) {
        if (this.tetromino === undefined) { return; }

        renderTetromino(
            this.tetromino,
            canvas,
            this.scale,
            this.x,
            this.y,
            this.width,
            this.height
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