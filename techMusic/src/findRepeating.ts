import { Equalable, arrayIsEqualEqualable } from "./equalable.js";

export default function findRepeating(arr: Equalable[], minRepeating?: number): Equalable[] {
    outer: for (let length = (minRepeating || 1); length < arr.length / 2 + 1; length++) {
        let a = arr.slice(0, length);
        let b = arr.slice(length, length * 2);
        if (arrayIsEqualEqualable(a, b)) {
            const repeatLength = arr.length / length;
            let i: number;
            let hitsLeft: number = repeatLength * 0.7;
            for (i = 0; i < repeatLength; i++) {
                let c = arr.slice(i * length, length * (i + 1));
                if (!arrayIsEqualEqualable(a, c)) {
                    hitsLeft--;
                    if (hitsLeft < 0) {
                        continue outer;
                    }
                }
            }
            return a;
        }
    }
    return arr;
}