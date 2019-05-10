import FnDef from "../fnDef.js";
const code = `
do
\tpause 255 ; not 65535 because it saves one byte! :)
loop
`.trim().split("\n");
export default class WaitForever extends FnDef {
    constructor() {
        super("waitForever", code);
    }
}
