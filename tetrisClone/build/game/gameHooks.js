import _null from "../utils/_null.js";
var GameHooks = /** @class */ (function () {
    function GameHooks() {
        this.newTetrominoFunc = _null;
        this.switchTetrominoFunc = _null;
        this.playField = _null;
        this.tetrominoGenerator = _null;
        this.physics = _null;
        this.hold = _null;
        this.scoring = _null;
    }
    GameHooks.prototype.setNewTetromino = function (func) {
        this.newTetrominoFunc = func;
    };
    GameHooks.prototype.newTetromino = function () {
        this.newTetrominoFunc();
    };
    GameHooks.prototype.setSwitchTetromino = function (func) {
        this.switchTetrominoFunc = func;
    };
    GameHooks.prototype.switchTetromino = function (tetromion) {
        this.switchTetrominoFunc(tetromion);
    };
    GameHooks.prototype.setTetromino = function (tetromino) {
        this.tetromino = tetromino;
    };
    GameHooks.prototype.getTetromino = function () {
        return this.tetromino;
    };
    GameHooks.prototype.setPlayField = function (playField) {
        this.playField = playField;
    };
    GameHooks.prototype.getPlayField = function () {
        return this.playField;
    };
    GameHooks.prototype.setGenerator = function (generator) {
        this.tetrominoGenerator = generator;
    };
    GameHooks.prototype.getGenerator = function () {
        return this.tetrominoGenerator;
    };
    GameHooks.prototype.setPhysics = function (physics) {
        this.physics = physics;
    };
    GameHooks.prototype.getPhysics = function () {
        return this.physics;
    };
    GameHooks.prototype.setHold = function (hold) {
        this.hold = hold;
    };
    GameHooks.prototype.getHold = function () {
        return this.hold;
    };
    GameHooks.prototype.setScoring = function (scoring) {
        this.scoring = scoring;
    };
    GameHooks.prototype.getScoring = function () {
        return this.scoring;
    };
    return GameHooks;
}());
export default GameHooks;
