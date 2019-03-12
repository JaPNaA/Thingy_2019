export function wait(milliseconds: number) {
    return new Promise(res => setTimeout(res, milliseconds));
}

export function nextFrame() {
    return new Promise(res => requestAnimationFrame(res));
}