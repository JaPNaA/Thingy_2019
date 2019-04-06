import shuffleArr from "../../utils/shuffleArr.js";
import tetrominosList from "./tetrominosList.js";
import TetrominoType from "./tetrominoType.js";

class TetrominoGenerator {
    public que: TetrominoType[];

    private static queLength = 5;

    private bag: TetrominoType[];

    constructor() {
        this.bag = [];
        this.que = [];
        this.refillBag();

        for (let i = 0; i < TetrominoGenerator.queLength; i++) {
            this.pushNextToQue();
        }
    }

    public next(): TetrominoType {
        this.pushNextToQue();
        return this.que.shift() as TetrominoType;
    }

    private pushNextToQue() {
        if (this.isQueEmpty()) {
            this.refillBag();
        }

        this.que.push(this.bag.pop() as TetrominoType);
    }

    private isQueEmpty(): boolean {
        return this.bag.length <= 0;
    }

    private refillBag(): void {
        const arr = shuffleArr(tetrominosList);
        this.bag = arr;
    }

}

export default TetrominoGenerator;