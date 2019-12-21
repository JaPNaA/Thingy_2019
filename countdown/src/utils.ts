export function round(number: number, factor: number): number {
    return Math.round(number / factor) / (1 / factor);
}

export function getElmById(id: string): HTMLElement {
    const elm = document.getElementById(id);
    if (!elm) { throw new Error("element with id '" + id + "' does not exist") }
    return elm;
}