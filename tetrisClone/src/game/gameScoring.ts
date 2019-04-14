import IGameHooks from "./iGameHooks";

class GameScoring {
    private game: IGameHooks;
    private static scoring: { [x: number]: number } = {
        1: 100,
        2: 300,
        3: 500,
        4: 800
    };

    private score: number;

    constructor(game: IGameHooks) {
        this.game = game;
        this.score = 0;
    }

    public clearLines(num: number): void {
        this.score += GameScoring.scoring[num] || 0;
        console.log(this.score);
    }
}

export default GameScoring;