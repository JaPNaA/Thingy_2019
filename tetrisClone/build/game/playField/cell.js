var Cell = /** @class */ (function () {
    function Cell() {
        // this.block = TetrominoType.z;
    }
    Cell.copy = function (cell) {
        var newCell = new Cell();
        newCell.block = cell.block;
        return cell;
    };
    Cell.prototype.isOccupied = function () {
        return this.block !== undefined;
    };
    return Cell;
}());
export default Cell;
