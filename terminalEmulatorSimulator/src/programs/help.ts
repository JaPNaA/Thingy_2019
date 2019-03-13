import Program from "./program.js";
import bashProgramMap from "./bashProgramMap.js";

class Help extends Program {
    public async run() {
        this.stdout.write("Welcome to the help. This simulation is mostly just be figuring out how unix does command arguments, so there's not much to functionality. The commands that are in this simulation are:\n");
        this.printCommands();
        return 0;
    }

    private printCommands() {
        for (const key of bashProgramMap.keys()) {
            this.stdout.write("  " + key + "\n");
        }
    }
}

bashProgramMap.set('help', Help);

export default Help;