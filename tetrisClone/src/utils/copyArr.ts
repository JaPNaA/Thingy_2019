export default function copyArr<T>(arr: T[]): T[] {
    const out = [];

    for (let i = 0; i < arr.length; i++) {
        out[i] = arr[i];
    }

    return out;
}