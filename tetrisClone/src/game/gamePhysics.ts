import IGameHooks from "./iGameHooks.js";
import Timer from "../utils/timer.js";

class GamePhysics {
    private game: IGameHooks;
    private fallTimer: Timer;

    private tetrominoOnGround: boolean;
    private timeNotMoving: number;

    private deltaTime: number;

    constructor(game: IGameHooks) {
        this.game = game;
        this.tetrominoOnGround = false;
        this.timeNotMoving = 0;
        this.deltaTime = 0;

        this.fallTimer = new Timer(1000);
        this.fallTimer.start();
    }

    public update(deltaTime: number): void {
        this.deltaTime = deltaTime;
        this.fallTetromino();
        this.lockTetromino();
    }

    public onNewTetromino() {
        this.fallTimer.restart();
        this.timeNotMoving = 0;
        this.tetrominoOnGround = false;
    }

    public tetrominoMoved() {
        this.timeNotMoving = 0;
    }

    private fallTetromino(): void {
        const tetromino = this.game.getTetromino();
        const field = this.game.getPlayField();
        if (!tetromino) { return; }

        this.fallTimer.update(this.deltaTime);

        for (; this.fallTimer.count > 0; this.fallTimer.count--) {
            if (tetromino.canFall(field.field)) {
                tetromino.fall();
            } else {
                break;
            }
        }

        if (tetromino.canFall(field.field)) {
            this.tetrominoOnGround = false;
            this.timeNotMoving = 0;
        } else {
            this.tetrominoOnGround = true;
        }
    }

    private lockTetromino(): void {
        if (this.tetrominoOnGround) {
            this.timeNotMoving += this.deltaTime;

            const tetromino = this.game.getTetromino();
            if (this.timeNotMoving > 500 && tetromino) {
                tetromino.placeOn(this.game.getPlayField().field);
                this.game.newTetromino();
            }
        }
    }
}

export default GamePhysics;