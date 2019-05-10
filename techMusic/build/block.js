class Block {
    constructor(start, length) {
        this.start = start;
        this.length = length;
    }
    render(X, height) {
        X.fillStyle = "#333333";
        X.fillRect(this.start, 0, this.length, height);
    }
    serialize() {
        if (this.length) {
            return `[${this.start},${this.length}]`;
        }
        else {
            return null;
        }
    }
}
export default Block;
