import PlayField from "./playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import TetrominoJ from "./tetromino/tetrominos/j.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import TetrominoI from "./tetromino/tetrominos/i.js";

class Game {
    private playfield: PlayField;
    private canvas: Canvas;
    private tetrominoGenerator: TetrominoGenerator;
    private tetromino?: Tetromino;

    constructor() {
        this.canvas = new Canvas();
        this.playfield = new PlayField();
        this.tetrominoGenerator = new TetrominoGenerator();

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
        if (this.tetromino) {
            // if (this.tetromino.y % 5 === 0) {
            //     // this.tetromino.matrix.rotate();
            // }
            if (this.tetromino.canFall(this.playfield.field)) {
                this.tetromino.fall();
            } else {
                this.tetromino.placeOn(this.playfield.field);
                this.tetromino = new tetrominoClassMap[this.tetrominoGenerator.next()]();
            }
        }

        this.playfield.setTetromino(this.tetromino);
        this.playfield.renderTo(this.canvas);
    }
}

export default Game;