export default function copy2dArr(arr, width, height) {
    var copy = [];
    for (var i = 0; i < height; i++) {
        copy[i] = [];
        for (var j = 0; j < width; j++) {
            copy[i][j] = arr[i][j];
        }
    }
    return copy;
}
