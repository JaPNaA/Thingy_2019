import copyArr from "./copyArr.js";

export default function shuffleArr<T>(arr: T[]): T[] {
    const copy: T[] = copyArr(arr);
    const out: T[] = [];

    for (let length = arr.length; length > 0; length--) {
        out.push(copy.splice(Math.floor(Math.random() * length), 1)[0]);
    }

    // console.log(out);

    return out;
}