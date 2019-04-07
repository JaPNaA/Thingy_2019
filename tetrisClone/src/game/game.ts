import PlayField from "./playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import TetrominoJ from "./tetromino/tetrominos/j.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import GameUI from "./ui/gameUI.js";
import GameHooks from "./gameHooks.js";

class Game {
    private hooks: GameHooks;

    private playfield: PlayField;
    private canvas: Canvas;
    private tetrominoGenerator: TetrominoGenerator;
    private tetromino?: Tetromino;
    private gameUI: GameUI;

    public constructor() {
        this.hooks = new GameHooks();

        this.canvas = new Canvas();

        this.playfield = new PlayField(this.hooks);
        this.tetrominoGenerator = new TetrominoGenerator();

        this.hooks.setPlayField(this.playfield);
        this.hooks.setGenerator(this.tetrominoGenerator);
        this.hooks.setNewTetromino(this.newTetromino.bind(this));

        this.gameUI = new GameUI(this.hooks);

        this.setup();
        this.reqanfLoop();
    }

    private setup() {
        this.canvas.appendTo(document.body);
        this.canvas.resize(720, 720);

        this.tetromino = new TetrominoJ();
        console.log(this.tetromino);
    }

    private reqanfLoop() {
        this.draw();
        requestAnimationFrame(this.reqanfLoop.bind(this));
    }

    private draw() {
        this.update();
        this.hooks.setTetromino(this.tetromino);
        this.playfield.renderTo(this.canvas);
    }

    private update() {
        if (this.tetromino) {
            // if (this.tetromino.y % 5 === 0) {
            //     // this.tetromino.matrix.rotate();
            // }
            if (this.tetromino.canFall(this.playfield.field)) {
                // this.tetromino.fall();
            } else {
            }
        }

        this.gameUI.update(16);
        this.playfield.update();
    }

    private newTetromino() {
        this.tetromino = new tetrominoClassMap[this.tetrominoGenerator.next()]();
    }
}

export default Game;