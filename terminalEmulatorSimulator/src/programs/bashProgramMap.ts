import Program from "./program";
import ReadStream from "../streams/readStream";
import WriteStream from "../streams/writeStream";

type ProgramClass = new (stdin: ReadStream<string>, stdout: WriteStream<string>) => Program;

const bashProgramMap: Map<string, ProgramClass> = new Map();

export default bashProgramMap;