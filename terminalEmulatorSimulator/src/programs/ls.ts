import Program from "./program.js";
import bashProgramMap from "./bashProgramMap.js";

class Ls extends Program {
    public async run() {
        return 0;
    }
}

bashProgramMap.set('ls', Ls);

export default Ls;