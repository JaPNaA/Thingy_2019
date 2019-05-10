import Block from "./block.js";

class Track {
    public blocks: Block[];
    public elm: HTMLDivElement;

    constructor(label: string, labelsElm: HTMLElement, private height: number) {
        this.blocks = [];

        const labelElm = document.createElement("div");
        labelElm.classList.add("label");
        labelElm.innerText = label;
        labelsElm.appendChild(labelElm);
        this.elm = labelElm;
    }

    public render(X: CanvasRenderingContext2D) {
        for (const block of this.blocks) {
            block.render(X, this.height);
        }
    }

    public setActive(active: boolean) {
        if (active) this.elm.classList.add("active");
        else this.elm.classList.remove("active");
    }

    public addBlock(block: Block) {
        this.blocks.push(block);
    }

    public removeBlock(block: Block) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
    }

    public serialize(): string {
        const arr = [];
        for (const block of this.blocks) {
            const str = block.serialize();
            if (str) {
                arr.push(str);
            }
        }
        return "[" + arr.join(",") + "]";
    }

    public restoreFrom(data: [number, number][]): void {
        const blocks: Block[] = [];

        for (const block of data) {
            blocks.push(new Block(block[0], block[1]));
        }

        this.blocks = blocks;
    }

    public deleteAll(): void {
        this.blocks.length = 0;
    }

    public getBlockIndexAt(x: number): number {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (
                block.start <= x &&
                x < block.start + block.length
            ) {
                return i;
            }
        }

        return -1;
    }

    public removeBlockAt(x: number): void {
        const blockIx = this.getBlockIndexAt(x);
        if (blockIx < 0) { return; }
        this.blocks.splice(blockIx, 1);
    }

    public getLength(): number {
        let max = 0;

        for (const block of this.blocks) {
            max = Math.max(block.start + block.length, max);
        }

        return max;
    }
}

export default Track;