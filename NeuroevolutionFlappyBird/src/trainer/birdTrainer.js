import Game from "../game/game";
import BirdBrain from "../nn/birdBrain";
import Wall from "../game/wall";

/**
 * @typedef {import("../game/bird").default} Bird
 * @typedef {(game: Game) => void} NewGameHandler
 */

class BirdTrainer {
    /**
     * @param {number} gameWidth 
     * @param {number} gameHeight 
     */
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        /** @type {NewGameHandler[]} */
        this.newGameHandlers = [];

        /** @type {Game} */
        this.currentGame = null;
        /** @type {[Bird, BirdBrain][]} */
        this.birds = [];

        /** @type {[Bird, BirdBrain][]} */
        this.aliveBirds = [];

        /** @type {BirdBrain | null} */
        this.bestBirdBrain = null;
    }

    /**
     * Add event listener to new game
     * @param {NewGameHandler} handler 
     */
    onNewGame(handler) {
        this.newGameHandlers.push(handler);
    }

    tick() {
        const aliveBirds = [];
        for (const bird of this.birds) {
            if (bird[0].alive) {
                aliveBirds.push(bird);
            }
        }

        if (aliveBirds.length <= 0) {
            this.letTheBirdsHaveBabiesAndStartNewGame();
        } else {
            this.aliveBirds = aliveBirds;
        }
    }

    /**
     * Imports a model
     * @param {string} str 
     */
    importModel(str) {
        const brain = new BirdBrain();
        brain.importString(str);

        this.currentGame = new Game(this.gameWidth, this.gameHeight);
        this._dispatchNewGame();
        this._killAllBirds();

        const bird = this.currentGame.addBird(brain.shouldFlap.bind(brain));
        this.birds.push([bird, brain]);
    }

    startTraining() {
        this.currentGame = new Game(this.gameWidth, this.gameHeight);
        this._dispatchNewGame();
        this._killAllBirds();

        for (let i = 0; i < BirdTrainer.concurrentBirds; i++) {
            const brain = new BirdBrain();
            const bird = this.currentGame.addBird(brain.shouldFlap.bind(brain));
            this.birds.push([bird, brain]);
        }
    }

    letTheBirdsHaveBabiesAndStartNewGame() {
        this.currentGame = new Game(this.gameWidth, this.gameHeight);
        this._dispatchNewGame();

        const bestBird = this._chooseBestBird();
        this._killAllBirdsExcept(bestBird);
        this.birds.push([bestBird[0], bestBird[1].clone()]);
        for (let i = 0; i < BirdTrainer.concurrentBirds; i++) {
            const brain = bestBird[1].clone();
            this.bestBirdBrain = brain;
            const bird = this.currentGame.addBird(brain.shouldFlap.bind(brain));
            brain.mutate();
            this.birds.push([bird, brain]);
        }
        bestBird[1].destory();
    }

    serialize() {
        const aliveBirds = this.birds.filter(e => e[0].alive);
        if (aliveBirds.length < 10) {
            return aliveBirds[0][1].serialize();
        } else if (this.bestBirdBrain) {
            return this.bestBirdBrain.serialize();
        } else {
            return "Unavailable. Try again";
        }
    }

    /**
     * Kills all birds except one
     * @param {[Bird, BirdBrain]} exceptionBird exception
     */
    _killAllBirdsExcept(exceptionBird) {
        for (const bird of this.birds) {
            if (exceptionBird === bird) { continue; }
            bird[1].destory();
        }
        for (const bird of this.aliveBirds) {
            if (exceptionBird === bird) { continue; }
            bird[1].destory();
        }
        this.birds.length = 0;
    }

    /**
     * Kills all birds. No exceptions.
     */
    _killAllBirds() {
        for (const bird of this.birds) {
            bird[1].destory();
        }
        for (const bird of this.aliveBirds) {
            bird[1].destory();
        }
        this.birds.length = 0;
    }

    _dispatchNewGame() {
        for (const newGameHandler of this.newGameHandlers) {
            newGameHandler(this.currentGame);
        }
    }

    _chooseBestBird() {
        let best = null;
        let bestLoss = null;
        for (const bird of this.aliveBirds) {
            const loss = this._getLoss(bird);
            if (!best || loss < bestLoss) {
                best = bird;
                bestLoss = loss;
            }
        }
        return best;
    }

    /**
     * @param {[Bird, BirdBrain]} bird 
     */
    _getLoss(bird) {
        const wall = bird[0].getFirstWall();
        const distFromTop = Math.abs(bird[0].y - wall.topOpening);
        const distFromBottom = Math.abs(bird[0].y - wall.bottomOpening);
        if (distFromBottom < Wall.openingSize && distFromTop < Wall.openingSize) {
            return 0;
        } else {
            return Math.min(distFromTop, distFromBottom);
        }
    }
}

BirdTrainer.concurrentBirds = 200;

export default BirdTrainer;