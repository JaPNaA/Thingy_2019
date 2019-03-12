const keydownCallbacks = [];
addEventListener("keydown", keydownHandler);
function keydownHandler(event) {
    for (const cb of keydownCallbacks) {
        cb(event);
    }
}
function nextKeystroke() {
    return new Promise(res => keydownCallbacks.push(res));
}
export default async function* KeyboardStream() {
    while (true) {
        yield await nextKeystroke();
    }
}
