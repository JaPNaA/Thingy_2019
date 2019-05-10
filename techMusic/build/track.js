import Block from "./block.js";
class Track {
    constructor(label, labelsElm, height) {
        this.height = height;
        this.blocks = [];
        const labelElm = document.createElement("div");
        labelElm.classList.add("label");
        labelElm.innerText = label;
        labelsElm.appendChild(labelElm);
        this.elm = labelElm;
    }
    render(X) {
        for (const block of this.blocks) {
            block.render(X, this.height);
        }
    }
    setActive(active) {
        if (active)
            this.elm.classList.add("active");
        else
            this.elm.classList.remove("active");
    }
    addBlock(block) {
        this.blocks.push(block);
    }
    removeBlock(block) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
    }
    serialize() {
        const arr = [];
        for (const block of this.blocks) {
            const str = block.serialize();
            if (str) {
                arr.push(str);
            }
        }
        return "[" + arr.join(",") + "]";
    }
    restoreFrom(data) {
        const blocks = [];
        for (const block of data) {
            blocks.push(new Block(block[0], block[1]));
        }
        this.blocks = blocks;
    }
    deleteAll() {
        this.blocks.length = 0;
    }
    getBlockIndexAt(x) {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.start <= x &&
                x < block.start + block.length) {
                return i;
            }
        }
        return -1;
    }
    removeBlockAt(x) {
        const blockIx = this.getBlockIndexAt(x);
        if (blockIx < 0) {
            return;
        }
        this.blocks.splice(blockIx, 1);
    }
    getLength() {
        let max = 0;
        for (const block of this.blocks) {
            max = Math.max(block.start + block.length, max);
        }
        return max;
    }
}
export default Track;
