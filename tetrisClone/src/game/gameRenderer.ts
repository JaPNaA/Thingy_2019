import IGameHooks from "./iGameHooks.js";
import Canvas from "../engine/canvas.js";
import TetrominoDisplay from "./graphics/tetrominoDisplay.js";
import NextTetrominosDisplay from "./graphics/nextTetrominosDisplay.js";

class GameRenderer {
    private game: IGameHooks;
    // TODO: Factor out TetrominoDisplay to another class
    private holdDisplay: TetrominoDisplay;
    private nextTetrominosDisplay: NextTetrominosDisplay;

    constructor(game: IGameHooks) {
        this.game = game;
        this.holdDisplay = new TetrominoDisplay(game);
        this.nextTetrominosDisplay = new NextTetrominosDisplay(this.game);
    }

    public render(canvas: Canvas) {
        const playfield = this.game.getPlayField();
        playfield.renderTo(128, 8, canvas);

        this.renderHold(canvas);
        this.renderNextTetrominos(canvas);
    }

    private renderHold(canvas: Canvas) {
        const hold = this.game.getLogic().getHold();
        this.holdDisplay.setTetromino(hold);
        this.holdDisplay.render(canvas);
    }

    private renderNextTetrominos(canvas: Canvas) {
        const next = this.game.getGenerator().que;
        this.nextTetrominosDisplay.setTetrominos(next);
        this.nextTetrominosDisplay.render(canvas);
    }
}

export default GameRenderer;