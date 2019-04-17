import shuffleArr from "../../utils/shuffleArr.js";
import tetrominosList from "./tetrominosList.js";
var TetrominoGenerator = /** @class */ (function () {
    function TetrominoGenerator() {
        this.bag = [];
        this.que = [];
        this.refillBag();
        for (var i = 0; i < TetrominoGenerator.queLength; i++) {
            this.pushNextToQue();
        }
    }
    TetrominoGenerator.prototype.next = function () {
        this.pushNextToQue();
        return this.que.shift();
    };
    TetrominoGenerator.prototype.pushNextToQue = function () {
        if (this.isQueEmpty()) {
            this.refillBag();
        }
        this.que.push(this.bag.pop());
    };
    TetrominoGenerator.prototype.isQueEmpty = function () {
        return this.bag.length <= 0;
    };
    TetrominoGenerator.prototype.refillBag = function () {
        var arr = shuffleArr(tetrominosList);
        this.bag = arr;
    };
    TetrominoGenerator.queLength = 5;
    return TetrominoGenerator;
}());
export default TetrominoGenerator;
