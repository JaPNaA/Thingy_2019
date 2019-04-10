import { Action, actionsList } from "./action.js";
import Keyboard from "../../engine/keyboard.js";

class KeyboardUI {
    public mappings: { [x: string]: Action } = {
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

    private reverseMappings: { [x: number]: string[] };

    private actionState: { [x: number]: boolean } = {
        [Action.rotateCW]: false,
        [Action.rotateCCW]: false,
        [Action.hardDrop]: false,
        [Action.hold]: false,
        [Action.pause]: false,
        [Action.left]: false,
        [Action.right]: false,
        [Action.down]: false
    };

    private onceActionState: { [x: number]: boolean } = {
        [Action.rotateCW]: false,
        [Action.rotateCCW]: false,
        [Action.hardDrop]: false,
        [Action.hold]: false,
        [Action.pause]: false,
        [Action.left]: false,
        [Action.right]: false,
        [Action.down]: false
    };

    private keyState: boolean[];

    public constructor() {
        this.keyState = this.createKeyState();
        this.reverseMappings = this.generateReverseMappings();
        this.addEventListeners();
    }

    public getAction(action: Action): boolean {
        return this.actionState[action];
    }

    public getOnceAction(action: Action): boolean {
        const state = this.onceActionState[action];
        this.onceActionState[action] = false;
        return state;
    }

    private addEventListeners() {
        this.keydownHandler = this.keydownHandler.bind(this);
        Keyboard.onKeydown(this.keydownHandler);

        this.keyupHandler = this.keyupHandler.bind(this);
        Keyboard.onKeyup(this.keyupHandler);
    }

    private createKeyState(): boolean[] {
        const arr: boolean[] = [];
        for (let i = 0; i < 255; i++) {
            arr[i] = false;
        }
        return arr;
    }

    private generateReverseMappings(): { [x: number]: string[] } {
        const keys = Object.keys(this.mappings);
        const reverseMap: { [x: number]: string[] } = {};

        for (const key of keys) {
            const value = this.mappings[key];
            if (reverseMap.hasOwnProperty(value)) {
                reverseMap[value].push(key);
            } else {
                reverseMap[value] = [key];
            }
        }

        return reverseMap;
    }

    // private updateAllActionStates(): void {
    //     for (const actionState of actionsList) {
    //         this.updateActionState(actionState);
    //     }
    // }

    private updateActionState(action: Action): void {
        const prevState = this.actionState[action];
        this.actionState[action] = false;

        for (const key of this.reverseMappings[action]) {
            if (this.keyState[parseInt(key)]) {
                this.actionState[action] = true;
                if (!prevState) {
                    this.onceActionState[action] = true;
                }
                return;
            }
        }
    }

    private keydownHandler(e: KeyboardEvent): void {
        this.keyState[e.keyCode] = true;
        this.keyChangeHandler(e);
    }

    private keyupHandler(e: KeyboardEvent): void {
        this.keyState[e.keyCode] = false;
        this.keyChangeHandler(e);
    }

    private keyChangeHandler(e: KeyboardEvent): void {
        const action = this.mappings[e.keyCode];
        if (action === undefined) { return; }
        e.preventDefault();
        this.updateActionState(action);
    }
}

export default KeyboardUI;