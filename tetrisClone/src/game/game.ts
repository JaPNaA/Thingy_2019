import PlayField from "./playField/playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import TetrominoJ from "./tetromino/tetrominos/j.js";
import Tetromino from "./tetromino/tetromino.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import GameUI from "./ui/gameUI.js";
import GameHooks from "./gameHooks.js";
import GamePhysics from "./gamePhysics.js";
import GameHold from "./gameHold.js";
import GameRenderer from "./gameRenderer.js";

class Game {
    private hooks: GameHooks;

    private playfield: PlayField;
    private canvas: Canvas;
    private tetrominoGenerator: TetrominoGenerator;
    private tetromino?: Tetromino;
    private gameUI: GameUI;
    private physics: GamePhysics;
    private hold: GameHold;
    private renderer: GameRenderer;

    private then: number;

    public constructor() {
        this.hooks = new GameHooks();

        this.canvas = new Canvas();

        this.tetrominoGenerator = new TetrominoGenerator();
        this.playfield = new PlayField(this.hooks);
        this.physics = new GamePhysics(this.hooks);
        this.hold = new GameHold(this.hooks);
        this.renderer = new GameRenderer(this.hooks);

        this.hooks.setPlayField(this.playfield);
        this.hooks.setGenerator(this.tetrominoGenerator);
        this.hooks.setPhysics(this.physics);
        this.hooks.setHold(this.hold);
        this.hooks.setNewTetromino(this.newTetromino.bind(this));
        this.hooks.setSwitchTetromino(this.switchTetromino.bind(this));

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
        this.hooks.setTetromino(this.tetromino);
        this.update();
        this.renderer.render(this.canvas);
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
        this.callNewTetrominoEvents();
    }

    private switchTetromino(tetromino: Tetromino) {
        this.tetromino = tetromino;
        this.callNewTetrominoEvents();
    }

    private callNewTetrominoEvents(): void {
        this.physics.onNewTetromino();
        this.hold.onNewTetromino();
    }
}

export default Game;