import Action from "./action";

class KeyboardUI {
    public mappings: { [x: number]: Action } = {
        38: Action.rotateCW, // up arrow
        88: Action.rotateCW, // x
        97: Action.rotateCW, // numpad 1
        101: Action.rotateCW, // numpad 5
        105: Action.rotateCW, // numpad 9
        17: Action.rotateCCW, // ctrl
        90: Action.rotateCCW, // z
        99: Action.rotateCW, // numpad 3
        103: Action.rotateCW, // numpad 7

        32: Action.hardDrop, // space
        104: Action.hardDrop, // numpad 8
        37: Action.left, // left arrow
        100: Action.left, // numpad 4
        39: Action.right, // right arrow
        102: Action.right, // numpad 6
        40: Action.down, // down arrow
        98: Action.down, // numpad 2

        16: Action.hold, // shift
        67: Action.hold, // c
        96: Action.hold, // numpad 0

        27: Action.pause, // esc
        112: Action.pause, // f1
    };

    public actionState: { [x: number]: boolean } = {
        [Action.rotateCW]: false,
        [Action.rotateCCW]: false,
        [Action.hardDrop]: false,
        [Action.hold]: false,
        [Action.pause]: false,
        [Action.left]: false,
        [Action.right]: false,
        [Action.down]: false
    };

    public keyState: boolean[];

    public constructor() {
        this.keyState = this.createKeyState();
    }

    private createKeyState(): boolean[] {
        const arr: boolean[] = [];
        for (let i = 0; i < 255; i++) {
            arr[i] = false;
        }
        return arr;
    }
}

export default KeyboardUI;