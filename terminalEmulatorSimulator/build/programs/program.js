class Program {
    constructor(stdin, stdout) {
        this.stdin = stdin;
        this.stdout = stdout;
        this.stdinBuffer = [];
        this.lineWaiters = [];
        this.stdin.onData(this.onData.bind(this));
    }
    async nextLine() {
        const firstNewlineIndex = this.stdinBuffer.indexOf("\n");
        if (firstNewlineIndex >= 0) {
            return this.stdinBuffer.splice(0, firstNewlineIndex + 1).join('');
        }
        else {
            await new Promise(res => this.lineWaiters.push(res));
            return this.stdinBuffer.splice(0, this.stdinBuffer.length).join('');
        }
    }
    onData(data) {
        if (data === '\b') {
            this.stdinBuffer.pop();
        }
        else {
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
