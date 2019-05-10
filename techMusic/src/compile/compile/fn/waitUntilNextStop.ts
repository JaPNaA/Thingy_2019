import FnDef from "../fnDef.js";

const waitUntilNextStopTemplate = `
do
\tif nextStop# <= time then
\t\treturn
\tendif
loop
`;

function generateFromTemplate(n: number): string[] {
    return waitUntilNextStopTemplate.replace(/#/g, n.toString()).trim().split("\n");
}

export default class WaitUntilNextStop extends FnDef {
    constructor(n: number) {
        super("waitUntilNextStop" + (n + 1), generateFromTemplate(n + 1));
    }
}