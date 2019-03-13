import Program from "./program.js";
import bashProgramMap from "./bashProgramMap.js";
class Echo extends Program {
    async run(args) {
        this.stdout.write(args.join(' ') + '\n');
        return 0;
    }
}
bashProgramMap.set("echo", Echo);
export default Echo;
