const SPACE = ' ';
class Cell {
    constructor(char = '\0') {
        this.char = char;
        this.text = document.createTextNode(char === '\0' ? SPACE : char);
    }
    setChar(char) {
        this.char = char;
        if (char === '\0') {
            this.text.nodeValue = SPACE;
        }
        else {
            this.text.nodeValue = char;
        }
    }
    getChar() {
        return this.char;
    }
    appendTo(parent) {
        parent.appendChild(this.text);
    }
}
export default Cell;
