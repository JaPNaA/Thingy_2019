class Block {
    constructor(
        public start: number,
        public length: number
    ) { }

    public render(X: CanvasRenderingContext2D, height: number) {
        X.fillStyle = "#333333";
        X.fillRect(this.start, 0, this.length, height);
    }

    public serialize(): string | null {
        if (this.length) {
            return `[${this.start},${this.length}]`;
        } else {
            return null;
        }
    }
}

export default Block;