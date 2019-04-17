var Action;
(function (Action) {
    Action[Action["rotateCW"] = 0] = "rotateCW";
    Action[Action["rotateCCW"] = 1] = "rotateCCW";
    Action[Action["hardDrop"] = 2] = "hardDrop";
    Action[Action["hold"] = 3] = "hold";
    Action[Action["pause"] = 4] = "pause";
    Action[Action["left"] = 5] = "left";
    Action[Action["right"] = 6] = "right";
    Action[Action["down"] = 7] = "down";
})(Action || (Action = {}));
var actionsList = [
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
