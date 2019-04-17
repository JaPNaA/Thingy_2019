var GameScoring = /** @class */ (function () {
    function GameScoring(game) {
        this.game = game;
        this.score = 0;
    }
    GameScoring.prototype.clearLines = function (num) {
        this.score += GameScoring.scoring[num] || 0;
        console.log(this.score);
    };
    GameScoring.scoring = {
        1: 100,
        2: 300,
        3: 500,
        4: 800
    };
    return GameScoring;
}());
export default GameScoring;
