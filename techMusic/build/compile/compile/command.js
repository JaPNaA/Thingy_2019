var Command;
(function (Command) {
    Command[Command["high"] = 0] = "high";
    Command[Command["low"] = 1] = "low";
    Command[Command["pause"] = 2] = "pause";
    Command[Command["let"] = 3] = "let";
    Command[Command["gosub"] = 4] = "gosub";
    Command[Command["suspend"] = 5] = "suspend";
    Command[Command["resume"] = 6] = "resume";
})(Command || (Command = {}));
export default Command;
