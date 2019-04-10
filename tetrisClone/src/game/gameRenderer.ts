import IGameHooks from "./iGameHooks.js";
import Canvas from "../engine/canvas.js";
import TetrominoDisplay from "./graphics/tetrominoDisplay.js";

class GameRenderer {
    private game: IGameHooks;
    private holdDisplay: TetrominoDisplay;

    constructor(game: IGameHooks) {
        this.game = game;
        this.holdDisplay = new TetrominoDisplay(game);
    }

    public render(canvas: Canvas) {
        const playfield = this.game.getPlayField();
        playfield.renderTo(128, 8, canvas);

        this.renderHold(canvas);
    }

    public renderHold(canvas: Canvas) {
        const hold = this.game.getLogic().getHold();
        this.holdDisplay.setTetromino(hold);
        this.holdDisplay.render(canvas);
    }
}

export default GameRenderer;