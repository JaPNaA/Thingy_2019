import PlayField from "./playField/playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import TetrominoJ from "./tetromino/tetrominos/j.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import GameUI from "./ui/gameUI.js";
import GameHooks from "./gameHooks.js";
import GamePhysics from "./gamePhysics.js";

class Game {
    private hooks: GameHooks;

    private playfield: PlayField;
    private canvas: Canvas;
    private tetrominoGenerator: TetrominoGenerator;
    private tetromino?: Tetromino;
    private gameUI: GameUI;
    private physics: GamePhysics;

    private then: number;

    public constructor() {
        this.hooks = new GameHooks();

        this.canvas = new Canvas();

        this.playfield = new PlayField(this.hooks);
        this.tetrominoGenerator = new TetrominoGenerator();
        this.physics = new GamePhysics(this.hooks);

        this.hooks.setPlayField(this.playfield);
        this.hooks.setGenerator(this.tetrominoGenerator);
        this.hooks.setPhysics(this.physics);
        this.hooks.setNewTetromino(this.newTetromino.bind(this));

        this.gameUI = new GameUI(this.hooks);
        this.then = performance.now();

        this.setup();
        this.reqanfLoop();
    }

    private setup() {
        this.canvas.appendTo(document.body);
        this.canvas.resize(720, 720);
        this.newTetromino();
    }

    private reqanfLoop() {
        this.draw();
        requestAnimationFrame(this.reqanfLoop.bind(this));
    }

    private draw() {
        this.update();
        this.hooks.setTetromino(this.tetromino);
        this.playfield.renderTo(8, 8, this.canvas);
    }

    private update() {
        const now = performance.now();
        const deltaTime = now - this.then;
        this.then = now;

        this.physics.update(deltaTime);
        this.gameUI.update(deltaTime);
        this.playfield.update();
    }

    private newTetromino() {
        this.tetromino = new tetrominoClassMap[this.tetrominoGenerator.next()](this.hooks);
        this.physics.onNewTetromino();
    }
}

export default Game;