export default function copy2dArr<T>(arr: T[][], width: number, height: number): T[][] {
    const copy: T[][] = [];
    for (let i = 0; i < height; i++) {
        copy[i] = [];

        for (let j = 0; j < width; j++) {
            copy[i][j] = arr[i][j];
        }
    }
    return copy;
}