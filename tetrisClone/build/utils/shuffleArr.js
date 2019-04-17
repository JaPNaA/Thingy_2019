import copyArr from "./copyArr.js";
export default function shuffleArr(arr) {
    var copy = copyArr(arr);
    var out = [];
    for (var length_1 = arr.length; length_1 > 0; length_1--) {
        out.push(copy.splice(Math.floor(Math.random() * length_1), 1)[0]);
    }
    // console.log(out);
    return out;
}
