export function round(number: number, factor: number): number {
    return Math.round(number / factor) * factor;
}