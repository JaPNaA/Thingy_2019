export function round(number: number, factor: number): number {
    return Math.round(number / factor) / (1 / factor);
}

export function getElmById(id: string): HTMLElement {
    return document.getElementById(id) as HTMLElement;
}