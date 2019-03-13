import Terminal from "./terminal.js";
import { wait } from "./utils.js";
import KeyboardStream from "./keyboardStream.js";
import ReadStream from "./streams/readStream.js";
import WriteStream from "./streams/writeStream.js";
import Program from "./programs/program.js";
import Bash from "./programs/bash.js";

const keymap: { [x: number]: string } = {
    8: '\b',
    9: '\t',
    13: '\n'
};

class App {
    private terminal: Terminal;
    private program: Program;

    private stdin: ReadStream<string>;
    private stdout: WriteStream<string>;
    private keyboardin: WriteStream<string>;
    private terminalin: ReadStream<string>;

    constructor() {
        this.stdin = new ReadStream();
        this.stdout = new WriteStream();
        this.keyboardin = new WriteStream();
        this.terminalin = new ReadStream();

        this.program = new Bash(this.stdin, this.stdout);

        this.terminal = new Terminal(80, 24);

        this.terminal.appendTo(document.body);

        this.setupPipes();
        this.program.run([]);

        console.log(this);
    }

    private setupPipes() {
        this.keyboardin.pipe(this.stdin);
        this.keyboardin.pipe(this.stdout);
        this.keyboardin.pipe(this.terminalin);
        this.stdout.pipe(this.terminalin);

        this.terminalin.onData(e => this.terminal.write(e));

        this.listenKeyboardin();
    }

    private async listenKeyboardin() {
        const keyboardStream = KeyboardStream();

        for await (const i of keyboardStream) {
            if (i.key.length === 1) {
                this.keyboardin.write(i.key);
            } else {
                const remapped = keymap[i.keyCode];
                if (remapped) {
                    this.keyboardin.write(remapped);
                }
            }
        }
    }
}

const app = new App();

export default app;