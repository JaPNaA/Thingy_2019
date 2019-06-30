import { keyboard } from "../../engine/ui/Keyboard";
import { mouse } from "../../engine/ui/Mouse";
import Game from "../../Game";
import Tank from "./Tank";

class Player extends Tank {
    constructor(game: Game, x: number, y: number) {
        super(game, x, y);
    }

    protected getMovement(): [number, number] {
        let ax = 0;
        let ay = 0;

        if (keyboard.isDown('w')) {
            ay -= 1;
        }
        if (keyboard.isDown('s')) {
            ay += 1;
        }
        if (keyboard.isDown('a')) {
            ax -= 1;
        }
        if (keyboard.isDown('d')) {
            ax += 1;
        }

        return [ax, ay];
    }

    protected getDirection(): [number, number] {
        return [mouse.x - this.x, mouse.y - this.y];
    }

    protected getTriggered(): boolean {
        return mouse.down;
    }
}

export default Player;