import ReadStream from "../streams/readStream.js";
import WriteStream from "../streams/writeStream.js";

abstract class Program {
    protected stdin: ReadStream<string>;
    protected stdout: WriteStream<string>;

    private stdinBuffer: string[];
    private lineWaiters: Function[];

    constructor(stdin: ReadStream<string>, stdout: WriteStream<string>) {
        this.stdin = stdin;
        this.stdout = stdout;

        this.stdinBuffer = [];
        this.lineWaiters = [];

        this.stdin.onData(this.onData.bind(this));
    }

    /**
     * run program
     * @returns exit code
     */
    public abstract async run(args: string[]): Promise<number>;

    protected async nextLine(): Promise<string> {
        const firstNewlineIndex = this.stdinBuffer.indexOf("\n");
        if (firstNewlineIndex >= 0) {
            return this.stdinBuffer.splice(0, firstNewlineIndex + 1).join('');
        } else {
            await new Promise(res => this.lineWaiters.push(res));
            return this.stdinBuffer.splice(0, this.stdinBuffer.length).join('');
        }
    }

    private onData(data: string) {
        if (data === '\b') {
            this.stdinBuffer.pop();
        } else {
            this.stdinBuffer.push(data);
        }

        if (data === '\n') {
            const lineWaiter = this.lineWaiters.shift();
            if (lineWaiter) {
                lineWaiter();
            }
        }
    }
}

export default Program;