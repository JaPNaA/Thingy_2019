import Terminal from "./terminal.js";
import { wait } from "./utils.js";
import KeyboardStream from "./keyboardStream.js";
class App {
    constructor() {
        this.terminal = new Terminal(80, 24);
        this.terminal.appendTo(document.body);
        this.pipeKeyboardToTerminal();
        this.writeTerminal();
    }
    async pipeKeyboardToTerminal() {
        const keyboardStream = KeyboardStream();
        for await (const i of keyboardStream) {
            this.terminal.write(i.key);
        }
    }
    async writeTerminal() {
        for (const c of "this is a test lol did you know that this was a test? I didn't know that this was a test? did you? I just asked that. oh well") {
            await wait(4);
            this.terminal.write(c);
        }
    }
}
const app = new App();
export default app;
