enum Action {
    rotateCW,
    rotateCCW,
    hardDrop,
    hold,
    pause,
    left,
    right,
    down
}

const actionsList: Action[] = [
    Action.rotateCW,
    Action.rotateCCW,
    Action.hardDrop,
    Action.hold,
    Action.pause,
    Action.left,
    Action.right,
    Action.down
];

export { Action, actionsList };