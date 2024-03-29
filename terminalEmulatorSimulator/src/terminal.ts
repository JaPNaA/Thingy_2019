import Cell from "./cell.js";
import { wait, nextFrame } from "./utils.js";

class Terminal {
    private table: HTMLTableElement;
    private tbody: HTMLTableSectionElement;

    private cursorX: number;
    private cursorY: number;
    private lastCursorX: number;
    private lastCursorY: number;

    private buffer: Cell[][];
    private tableBuffer: HTMLTableCellElement[][];

    private reqanfHandle: number;

    constructor(public width: number, public height: number) {
        this.table = document.createElement("table");
        this.table.classList.add("terminal");

        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.tbody);

        this.cursorY = 0;
        this.cursorX = 0;

        this.lastCursorX = 1; // is 1 to trigger cursor update
        this.lastCursorY = 0;

        this.buffer = [];
        this.tableBuffer = [];
        this.createBuffer();
        this.createTable();

        this.reqanfHandle = -1;
        this.startReqanfLoop();
        this.setTDDimensions();
    }

    public write(str: string) {
        for (const char of str) {
            switch (char) {
                case '\n':
                    this.buffer[this.cursorY][this.cursorX].setChar(char);
                    this.cursorX = 0;
                    this.cursorY++;
                    this.wrapCursor();
                    break;
                case '\b':
                    this.cursorX--;
                    this.wrapCursor();
                    this.buffer[this.cursorY][this.cursorX].setChar('\0');
                    break;
                default:
                    this.buffer[this.cursorY][this.cursorX].setChar(char);
                    this.cursorX++;
                    this.wrapCursor();
                    break;
            }
        }
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.table);
    }

    public destory() {
        cancelAnimationFrame(this.reqanfHandle);
    }

    private wrapCursor() {
        if (this.cursorX >= this.width) {
            this.cursorX = 0;
            this.cursorY++;
        } else if (this.cursorX < 0) {
            this.cursorX = this.width - 1;
            this.cursorY--;
        }

        if (this.cursorY >= this.height) {
            this.scroll();
        } else if (this.cursorY < 0) {
            this.cursorY = 0;
            this.cursorX = 0;
        }
    }

    private updateCursorPos() {
        if (this.lastCursorX === this.cursorX && this.lastCursorY === this.cursorY) { return; }
        this.tableBuffer[this.lastCursorY][this.lastCursorX].classList.remove("cursor");
        this.tableBuffer[this.cursorY][this.cursorX].classList.add("cursor");
        this.lastCursorX = this.cursorX;
        this.lastCursorY = this.cursorY;
    }

    private scroll() {
        const firstTableBuffer = this.tableBuffer.shift();
        const bufRow = this.createBufferRow();
        const { row, tr } = this.createTableRow(bufRow);

        this.buffer.shift();

        this.buffer.push(bufRow);
        this.tableBuffer.push(row);

        this.tbody.appendChild(tr);

        if (firstTableBuffer && firstTableBuffer[0].parentElement) {
            this.tbody.removeChild(firstTableBuffer[0].parentElement);
        }

        this.cursorY--;
        this.lastCursorY--;
    }

    private createBuffer() {
        for (let y = 0; y < this.height; y++) {
            this.buffer[y] = this.createBufferRow();
        }
    }

    private createBufferRow(): Cell[] {
        const arr: Cell[] = [];

        for (let x = 0; x < this.width; x++) {
            arr[x] = new Cell();
        }

        return arr;
    }

    private createTable() {
        for (let y = 0; y < this.height; y++) {
            const { tr, row } = this.createTableRow(this.buffer[y]);
            this.tableBuffer[y] = row;
            this.tbody.appendChild(tr);
        }
    }

    private createTableRow(bufferRow: Cell[]) {
        const tr = document.createElement("tr");
        const arr = [];

        for (let x = 0; x < this.width; x++) {
            const td = document.createElement("td");
            arr[x] = td;
            bufferRow[x].appendTo(td);
            tr.appendChild(td);
        }

        return { tr: tr, row: arr };
    }

    private startReqanfLoop() {
        this.reqanfHandle = requestAnimationFrame(this.reqanf.bind(this));
    }

    private reqanf() {
        this.updateCursorPos();
        this.startReqanfLoop();
    }

    private async setTDDimensions() {
        await nextFrame();

        const textBox = document.createElement("span");
        textBox.style.fontFamily = getComputedStyle(this.table).fontFamily;
        textBox.style.opacity = "0";
        textBox.innerHTML = 'A';
        document.body.appendChild(textBox);

        await nextFrame();

        const box = textBox.getBoundingClientRect();
        this.table.style.setProperty("--char-width", box.width + "px");
        this.table.style.setProperty("--char-height", box.height + "px");

        document.body.removeChild(textBox);
    }
}

export default Terminal;