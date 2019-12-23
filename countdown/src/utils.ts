export function round(number: number, factor: number): number {
    return Math.round(number / factor) / (1 / factor);
}

export function getElmById(id: string): HTMLElement {
    const elm = document.getElementById(id);
    if (!elm) { throw new Error("element with id '" + id + "' does not exist") }
    return elm;
}

let a = 0;

export function registerResizeHandler(handler: () => void): void {
    let lastInnerWidth = innerWidth;
    let lastInnerHeight = innerHeight;

    function checkResize() {
        document.title = (++a).toString();
        if (
            lastInnerWidth === innerWidth &&
            lastInnerHeight === innerHeight
        ) {
            // ios resize handling
            requestAnimationFrame(() => checkResize());
        } else {
            handler();
            lastInnerWidth = innerWidth;
            lastInnerHeight = innerHeight;
        }
    }

    addEventListener("resize", checkResize);
}
