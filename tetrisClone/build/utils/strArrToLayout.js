import Cell from "../game/playField/cell.js";
export default function strArrToLayout(arr, type) {
    var out = [];
    var height = arr.length;
    var width = arr[0].length;
    for (var i = 0; i < height; i++) {
        out[i] = [];
        for (var j = 0; j < width; j++) {
            out[i][j] = new Cell();
            if (arr[i][j] === "#") {
                out[i][j].block = type;
            }
        }
    }
    return out;
}
