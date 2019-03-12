const SPACE = ' ';

class Cell {
    private text: Text;

    constructor(
        private char: string = '\0'
    ) {
        this.text = document.createTextNode(char === '\0' ? SPACE : char);
    }

    public setChar(char: string) {
        this.char = char;

        if (char === '\0') {
            this.text.nodeValue = SPACE;
        } else {
            this.text.nodeValue = char;
        }
    }

    public getChar() {
        return this.char;
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.text);
    }
}

export default Cell;