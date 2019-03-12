import Cell from "./cell.js";
import { wait, nextFrame } from "./utils.js";

class Terminal {
    private table: HTMLTableElement;

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

        this.lastCursorX = this.cursorX = 0;
        this.lastCursorY = this.cursorY = 0;

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
            this.buffer[this.cursorY][this.cursorX].setChar(char);

            this.cursorX++;
            if (this.cursorX >= this.width) {
                this.cursorX = 0;
                this.cursorY++;
            }
        }
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.table);
    }

    public destory() {
        cancelAnimationFrame(this.reqanfHandle);
    }

    private updateCursorPos() {
        if (this.lastCursorX === this.cursorX && this.lastCursorY === this.cursorY) { return; }
        this.tableBuffer[this.lastCursorY][this.lastCursorX].classList.remove("cursor");
        this.tableBuffer[this.cursorY][this.cursorX].classList.add("cursor");
        this.lastCursorX = this.cursorX;
        this.lastCursorY = this.cursorY;
    }

    private createBuffer() {
        for (let y = 0; y < this.height; y++) {
            const arr: Cell[] = [];

            for (let x = 0; x < this.width; x++) {
                arr[x] = new Cell();
            }

            this.buffer[y] = arr;
        }
    }

    private createTable() {
        const tbody = document.createElement("tbody");

        for (let y = 0; y < this.height; y++) {
            const tr = document.createElement("tr");
            this.tableBuffer[y] = [];

            for (let x = 0; x < this.width; x++) {
                const td = document.createElement("td");
                this.tableBuffer[y][x] = td;
                this.buffer[y][x].appendTo(td);
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        this.table.appendChild(tbody);
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