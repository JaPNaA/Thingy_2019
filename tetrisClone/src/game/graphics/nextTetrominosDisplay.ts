import TetrominoDisplay from "./tetrominoDisplay.js";
import IGameHooks from "../iGameHooks.js";
import TetrominoType from "../tetromino/tetrominoType.js";
import Canvas from "../../engine/canvas.js";
import TetrominoGenerator from "../tetromino/tetrominoGenerator.js";

class NextTetrominosDisplay {
    private displays: TetrominoDisplay[];
    private game: IGameHooks;

    constructor(game: IGameHooks) {
        this.game = game;
        this.displays = [];
        this.createDisplays();
    }

    public render(canvas: Canvas) {
        for (let i = 0; i < this.displays.length; i++) {
            this.displays[i].render(canvas);
        }
    }

    public setTetrominos(nextTetrominos: TetrominoType[]) {
        for (let i = 0; i < nextTetrominos.length; i++) {
            this.displays[i].setTetromino(nextTetrominos[i]);
        }
    }

    private createDisplays(): void {
        for (let i = 0; i < TetrominoGenerator.queLength; i++) {
            this.displays[i] = new TetrominoDisplay(
                this.game, {
                    x: 480,
                    y: 8 + 104 * i,
                    scale: 24,
                    width: 4,
                    height: 4
                }
            );
        }
    }
}

export default NextTetrominosDisplay;