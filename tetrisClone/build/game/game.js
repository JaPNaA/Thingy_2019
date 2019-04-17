import PlayField from "./playField/playfield.js";
import Canvas from "../engine/canvas.js";
import TetrominoGenerator from "./tetromino/tetrominoGenerator.js";
import tetrominoClassMap from "./tetromino/tetrominoClassMap.js";
import GameUI from "./ui/gameUI.js";
import GameHooks from "./gameHooks.js";
import GamePhysics from "./gamePhysics.js";
import GameHold from "./gameHold.js";
import GameRenderer from "./gameRenderer.js";
import GameScoring from "./gameScoring.js";
var Game = /** @class */ (function () {
    function Game() {
        this.hooks = new GameHooks();
        this.canvas = new Canvas();
        this.tetrominoGenerator = new TetrominoGenerator();
        this.playfield = new PlayField(this.hooks);
        this.physics = new GamePhysics(this.hooks);
        this.hold = new GameHold(this.hooks);
        this.renderer = new GameRenderer(this.hooks);
        this.scoring = new GameScoring(this.hooks);
        this.hooks.setPlayField(this.playfield);
        this.hooks.setGenerator(this.tetrominoGenerator);
        this.hooks.setPhysics(this.physics);
        this.hooks.setHold(this.hold);
        this.hooks.setNewTetromino(this.newTetromino.bind(this));
        this.hooks.setSwitchTetromino(this.switchTetromino.bind(this));
        this.hooks.setScoring(this.scoring);
        this.gameUI = new GameUI(this.hooks);
        this.then = performance.now();
        this.setup();
        this.reqanfLoop();
    }
    Game.prototype.setup = function () {
        this.canvas.appendTo(document.body);
        this.canvas.resize(720, 720);
        this.newTetromino();
    };
    Game.prototype.reqanfLoop = function () {
        this.draw();
        requestAnimationFrame(this.reqanfLoop.bind(this));
    };
    Game.prototype.draw = function () {
        this.hooks.setTetromino(this.tetromino);
        this.update();
        this.renderer.render(this.canvas);
    };
    Game.prototype.update = function () {
        var now = performance.now();
        var deltaTime = now - this.then;
        this.then = now;
        this.physics.update(deltaTime);
        this.gameUI.update(deltaTime);
        this.playfield.update();
    };
    Game.prototype.newTetromino = function () {
        this.tetromino = new tetrominoClassMap[this.tetrominoGenerator.next()](this.hooks);
        this.callNewTetrominoEvents();
    };
    Game.prototype.switchTetromino = function (tetromino) {
        this.tetromino = tetromino;
        this.callNewTetrominoEvents();
    };
    Game.prototype.callNewTetrominoEvents = function () {
        this.physics.onNewTetromino();
        this.hold.onNewTetromino();
    };
    return Game;
}());
export default Game;
