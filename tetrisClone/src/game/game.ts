import PlayField from "./playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import TetrominoJ from "./tetromino/tetrominos/j.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import Keyboard from "../engine/keyboard.js";

class Game {
    private playfield: PlayField;
    private canvas: Canvas;
    private tetrominoGenerator: TetrominoGenerator;
    private tetromino?: Tetromino;

    public constructor() {
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

        Keyboard.onKeydown(data => {
            if (!this.tetromino) { return; }

            switch (data.keyCode) {
                case 38: // up
                    this.tetromino.rotate();
                    break;
                case 37: // left
                    if (this.tetromino.canGoLeft(this.playfield.field)) {
                        this.tetromino.left();
                    }
                    break;
                case 39: // right
                    if (this.tetromino.canGoRight(this.playfield.field)) {
                        this.tetromino.right();
                    }
                    break;
                case 40: // down
                    this.tetromino.fall();
                    break;
            }
        });
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
                // this.tetromino.fall();
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