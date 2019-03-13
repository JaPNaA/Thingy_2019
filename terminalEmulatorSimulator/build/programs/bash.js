import Program from "./program.js";
import "./_programsImporter.js";
import bashProgramMap from "./bashProgramMap.js";
import ReadStream from "../streams/readStream.js";
const quotes = ["'", '"'];
class Bash extends Program {
    constructor(stdin, stdout) {
        super(stdin, stdout);
        this.programStdin = new ReadStream();
        stdin.pipe(this.programStdin);
    }
    async run() {
        this.stdout.write("Welcome to simulated bash. Type \"help\" for help\n");
        await this.listenForCommands();
        return 1;
    }
    async listenForCommands() {
        while (true) {
            this.stdout.write("$ ");
            await this.doOneCommand();
            this.programStdin.cutOff();
        }
    }
    async doOneCommand() {
        const line = (await this.nextLine()).trim();
        // (".*?")|('.*?')
        let { command, args } = await this.stringToCommandAndArgs(line);
        const Program = this.findProgram(command);
        if (Program === undefined) {
            this.stdout.write(command + ": command not found\n");
            return;
        }
        const program = new Program(this.programStdin, this.stdout);
        program.run(args);
    }
    async stringToCommandAndArgs(str) {
        const firstSpaceIndex = str.indexOf(' ');
        let command, argsString;
        if (firstSpaceIndex < 0) {
            command = str;
            argsString = '';
        }
        else {
            command = str.slice(0, str.indexOf(' '));
            argsString = str.slice(str.indexOf(' ') + 1);
        }
        const args = await this.stringToArgs(argsString);
        return { command, args };
    }
    // what a terrible and unreadable function.
    async stringToArgs(strin) {
        const args = [];
        let str = strin + "\n";
        let inQuotes = false;
        let escaped = false;
        let startToken;
        let arg = '';
        let i = 0;
        while (true) {
            const char = str[i];
            // if out of characters...
            if (!char) {
                // ... and still in quotes
                if (inQuotes || escaped) {
                    // request for more
                    this.stdout.write("> ");
                    str += await this.nextLine();
                    continue;
                }
                else {
                    // if not in quotes, done.
                    break;
                }
            }
            // if char is a quote
            if (quotes.includes(char)) {
                // ignore if escaped
                if (escaped) {
                    // remove '\' and add char
                    arg = arg.substr(0, arg.length - 1) + char;
                }
                else {
                    if (inQuotes) {
                        // check if quote ends
                        if (startToken === char) {
                            inQuotes = false;
                        }
                        else {
                            arg += char;
                        }
                    }
                    else {
                        // new quote
                        startToken = char;
                        inQuotes = true;
                    }
                }
            }
            else if (char === ' ' && !inQuotes) {
                // if in quotes, allow space in args
                if (arg) {
                    args.push(arg);
                }
                arg = '';
            }
            else if (char === '\n') {
                if (escaped) {
                    arg = arg.substr(0, arg.length - 1);
                }
                else if (inQuotes) {
                    arg += char;
                }
            }
            else {
                if (char === "\\") {
                    escaped = true;
                }
                else {
                    escaped = false;
                }
                arg += char;
            }
            i++;
        }
        // push last arg
        if (arg) {
            args.push(arg);
        }
        return args;
    }
    findProgram(command) {
        return bashProgramMap.get(command);
    }
}
export default Bash;
