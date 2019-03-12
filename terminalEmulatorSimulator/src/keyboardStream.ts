const keydownCallbacks: Function[] = [];
addEventListener("keydown", keydownHandler);

function keydownHandler(event: KeyboardEvent) {
    for (const cb of keydownCallbacks) {
        cb(event);
    }
}

function nextKeystroke(): Promise<KeyboardEvent> {
    return new Promise(res => keydownCallbacks.push(res));
}

export default async function* KeyboardStream() {
    while (true) {
        yield await nextKeystroke();
    }
}