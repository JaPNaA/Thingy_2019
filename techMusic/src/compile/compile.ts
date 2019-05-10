import Track from "../track.js";
import SuffixTree from "../suffixTree.js";
import SymbolLine from "./compile/symbol/line.js";
import LetLine from "./compile/let.js";
import FnDef from "./compile/fnDef.js";
import ProgramLine from "./compile/programLine.js";
import ProgramComponent from "./compile/component.js";
import TimeVar from "./compile/timeVar.js";
import WhiteSpaceLine from "./compile/whiteSpace.js";
import EnableTimeLine from "./compile/enableTime.js";
import Instruction from "./compile/instruction.js";
import Command from "./compile/command.js";
import SymbolB from "./compile/symbol/b.js";
import SymbolW from "./compile/symbol/w.js";
import VariableSymbolLine from "./compile/symbol/variable.js";
import ForLoop from "./compile/forLoop.js";
import CommentLine from "./compile/comment.js";
// import WaitUntilNextStop from "./compile/fn/waitUntilNextStop.js";
import WaitForever from "./compile/fn/waitForever.js";
import Stack from "./compile/stack.js";
import ILetLine from "./compile/iLet.js";
import Define from "./compile/define.js";
import TrackState from "../trackState.js";
import { Equalable } from "../equalable.js";
import { lineIsCallToFunctionWithReference } from "../callToFunctionWithReference.js";
import CountingMap from "../countingMap.js";
class Program {
    private tracks: Track[];
    private labels: string[];
    private bpm: number;
    private beatLength: number;
    private inBetweens: number;
    private step: number;
    // private timeOffsets: number;

    private defines: Define[];
    private symbolLines: SymbolLine[];
    private letLines: ILetLine[];
    private fnDefs: FnDef[];
    private lines: ProgramLine[][];
    private components: ProgramComponent[];

    private declaredTimeVars: TimeVar[];
    private stacks: Stack[];
    // private declaredWaitUntilNextStops: WaitUntilNextStop[];
    private trackStatesFunctionMap: Map<TrackState[], FnDef>;

    private workingTrackIndex?: number;
    private functionNameCounter: number;
    private didCombineIntoFunction: boolean;

    /** constant variable names */
    private V = {
        beatLength: "beatLength",
        bpm: "bpm",
        nextStop: "nextStop",
        // waitUntilNextStop: "waitUntilNextStop",
        waitForever: "waitForever"
    };

    /** variable names */
    private v = {
        temp: "temp",
        i: "i",
        nextStop: "nextStop",
        genericFnName: "fn"
    };

    private config = {
        maxTimesRepeated: 3,
        timeOffset: 1, // TODO: set this to the proper offset
        distributedTimeOffset: 3
    };

    constructor(tracks: Track[], inBetweens: number, bpm: number, labels: string[]) {
        this.tracks = tracks;
        this.labels = labels;
        this.bpm = bpm;
        this.beatLength = 60_000 / bpm;
        this.inBetweens = inBetweens;
        this.step = 1 / inBetweens;
        // this.timeOffsets = -2;

        this.defines = [];
        this.symbolLines = [];
        this.letLines = [];
        this.fnDefs = [];
        this.lines = [];
        this.components = [];

        this.declaredTimeVars = [];
        this.stacks = [];
        // this.declaredWaitUntilNextStops = [];
        this.trackStatesFunctionMap = new Map();

        this.functionNameCounter = 0;
        this.didCombineIntoFunction = false;

        this.defineLEDSymbols();
        this.defineVariables();
        this.writeMainCode();
        this.expandPauses();
        this.combineRepeatingCode();
        this.defineFunctions();
        this.sortComponents();
        this.setupComponents();
        this.sortSymbolLines();
        this.assignVariableSymbolValues();
        this.removeUnnecessaryStackCalls();
        this.removeUnusedFunctions();
        this.inlineFunctionsUsedOnlyOnce();
    }

    public compile(): string {
        const str: (ProgramLine | string)[] = [];

        str.push(new CommentLine(note));
        str.push(new WhiteSpaceLine());

        for (const define of this.defines) {
            const defineStr = define.toString();
            if (defineStr) { str.push(defineStr); }
        }

        str.push(new WhiteSpaceLine());

        for (const symbolLine of this.symbolLines) {
            const symbolStr = symbolLine.toString();
            if (symbolStr) {
                str.push(symbolStr);
            }
        }

        str.push(new WhiteSpaceLine());


        let start0Lines: (ProgramLine | string)[] = [];
        start0Lines = start0Lines.concat(this.letLines);
        start0Lines.push(new WhiteSpaceLine());
        start0Lines.push(new EnableTimeLine());
        start0Lines.push(new WhiteSpaceLine());

        for (let i = 0; i < this.tracks.length; i++) {
            start0Lines.push(new Instruction(Command.resume, i + 1));
        }

        start0Lines.push(new Instruction(Command.gosub, this.V.waitForever));
        str.push(new FnDef("start0", start0Lines, "end"));


        str.push(new WhiteSpaceLine());

        for (let i = 0; i < this.lines.length; i++) {
            const trackInstructions = this.lines[i];
            this.workingTrackIndex = i;
            // this.combineRepeating(trackInstructions);
            str.push(new FnDef("start" + (i + 1), trackInstructions, "end"));
            str.push(new WhiteSpaceLine());
        }
        this.workingTrackIndex = undefined;

        str.push(new WhiteSpaceLine());

        for (const fnDef of this.fnDefs) {
            const fnDefStr = fnDef.toString();
            if (fnDefStr) { str.push(fnDefStr); }
        }

        return this.joinLines(str);
    }

    private joinLines(arr: (string | ProgramLine)[]): string {
        return arr.map(e => e.toString()).join("\n");
    }

    private defineLEDSymbols(): void {
        for (let i = 0; i < this.tracks.length; i++) {
            this.symbolLines.push(new SymbolLine(this.labels[i], pins[i]));
        }
    }

    private defineVariables(): void {
        this.symbolLines.push(new SymbolLine(this.V.bpm, this.bpm.toString()));
        this.symbolLines.push(new SymbolLine(
            this.V.beatLength,
            Math.round(this.beatLength + this.config.distributedTimeOffset).toString(),
            "60000 / bpm" + ((this.config.distributedTimeOffset) ? " + " + this.config.distributedTimeOffset : "") + ", rounded"
        ));
        this.beatLength += this.config.distributedTimeOffset;
        // this.letLines.push(new LetLine(this.V.beatLength, this.V.beatLength + "; offset, gained through experimentation"));

        for (let i = 0; i < this.tracks.length; i++) {
            this.workingTrackIndex = i;
            const stack = new Stack(i + 1);
            this.components.push(stack);
            this.stacks[i] = stack;
            this.symbolLines.push(new SymbolB(this.tracksOwn(this.v.i)));
            // this.symbolLines.push(new SymbolB(this.tracksOwn(this.v.nextStop)));
            this.symbolLines.push(new SymbolW(this.tracksOwn(this.v.temp)));
        }
        this.workingTrackIndex = undefined;
    }

    private defineFunctions(): void {
        // for (let i = 0; i < this.tracks.length; i++) {
        //     const def = new WaitUntilNextStop(i);
        //     this.declaredWaitUntilNextStops[i] = def;
        //     this.fnDefs.push(def);
        // }
        this.fnDefs.push(new WaitForever());
    }

    private writeMainCode(): void {
        for (let i = 0; i < this.tracks.length; i++) {
            this.workingTrackIndex = i;
            this.lines[i] = this.writeTrackCode(this.tracks[i]);
        }
        this.workingTrackIndex = undefined;
    }

    private writeTrackCode(track: Track): Instruction[] {
        const states: TrackState[] = [];
        const length = track.getLength();
        let lastState: boolean;

        for (let x = 0; x < length; x += this.step) {
            states.push(new TrackState(track.getBlockIndexAt(x) >= 0));
        }

        lastState = this.getLastState(states);
        this.compressState(states);
        const lines = this.writeCodeWithTrackStates(states);
        if (lastState) {
            lines.push(new Instruction(Command.low, this.labels[this.workingTrackIndex as number]));
        }
        lines.push(new Instruction(Command.gosub, this.V.waitForever));

        return lines;
    }

    private writeCodeWithTrackStates(states: TrackState[]): Instruction[] {
        let currState = this.getFirstState(states);
        const instructions: Instruction[] = [];

        for (const state of states) {
            if (state.ref) {
                const firstState = this.getFirstState(state.ref);
                if (firstState !== currState) {
                    instructions.push(new Instruction(
                        (firstState) ? Command.high : Command.low,
                        this.labels[this.workingTrackIndex as number]
                    ));
                }
                instructions.push(new Instruction(Command.gosub, this.makeFunctionWithTrackStates(state.ref)));
                currState = this.getLastState(state.ref);
            } else {
                if (state.bool !== currState) {
                    instructions.push(new Instruction(
                        (state.bool) ? Command.high : Command.low,
                        this.labels[this.workingTrackIndex as number]
                    ));
                }
                currState = state.bool as boolean;

                this.writeEighthPausesIn(instructions, this.step);
            }
        }

        this.compressSimpleInstructions(instructions);

        return instructions;
    }

    private compressSimpleInstructions(instructions: Instruction[]): void {
        this.inlineSingleLineFunctions(instructions);
        this.compressPauses(instructions);
    }

    private compressPauses(instructions: Instruction[]): void {
        let pauseLength = 0;
        let instructionLength = 0;
        for (let i = instructions.length - 1; i >= 0; i--) {
            const instruction = instructions[i];
            // TODO: make T1 not hard-coded
            if (
                instruction.command === Command.pause &&
                instruction.argument instanceof TimeVar
            ) {
                pauseLength += instruction.argument.length;
                instructionLength++;
            } else {
                if (pauseLength) {
                    // TODO: don't make that hard-coded either
                    instructions.splice(
                        i + 1, instructionLength,
                        ...this.getEighthPauses(pauseLength)
                    );
                }
                pauseLength = 0;
                instructionLength = 0;
            }
        }

        if (pauseLength) {
            instructions.splice(0, instructionLength, ...this.getEighthPauses(pauseLength));
        }
    }

    private inlineSingleLineFunctions(instructions: Instruction[]): void {
        for (let i = 0; i < instructions.length; i++) {
            const instruction = instructions[i];
            if (
                instruction.command === Command.gosub &&
                instruction.argument instanceof FnDef &&
                instruction.argument.instructions.length === 1
            ) {
                instructions[i] = instruction.argument.instructions[0] as Instruction;
            }
        }
    }

    private makeFunctionWithTrackStates(states: TrackState[]): FnDef {
        let alreadyDefinedFn = this.trackStatesFunctionMap.get(states);
        if (alreadyDefinedFn) {
            return alreadyDefinedFn;
        } else {
            const fn = new FnDef(
                "function" + (this.functionNameCounter++),
                this.writeCodeWithTrackStates(states),
                undefined, this.workingTrackIndex
            );
            this.fnDefs.push(fn);
            this.trackStatesFunctionMap.set(states, fn);
            return fn;
        }
    }

    private getFirstState(state: TrackState[]): boolean {
        let curr = state[0];
        while (curr.ref) {
            curr = curr.ref[0];
        }
        return curr.bool as boolean;
    }

    private getLastState(state: TrackState[]): boolean {
        let curr = state[state.length - 1];
        while (curr.ref) {
            curr = curr.ref[curr.ref.length - 1];
        }
        return curr.bool as boolean;
    }

    private compressState(state: TrackState[]): TrackState[][] {
        const repeating: TrackState[][] = [];
        while (true) {
            const stree = new SuffixTree(state);
            const nonOverlapping = stree.getLongestNonOverlappingRepeating(4) as TrackState[];
            if (!nonOverlapping || nonOverlapping.length < 4) { break; }
            arrayFindReplaceAll(state, nonOverlapping, new TrackState(nonOverlapping));
            repeating.push(nonOverlapping);
        }
        return repeating;
    }

    // private writePauseIn(instructions: Instruction[], now: number, last: number): void {
    //     const time = now - last;
    //     const fullBeats = Math.floor(time);
    //     const eighths = (time % 1);
    //     const timeInSeconds = now * this.beatLength / 1000;
    //     const timeDecimals = timeInSeconds % 1;
    //     const timeDiffFromInt = Math.min(1 - timeDecimals, timeDecimals);

    //     this.writeFullBeatPausesIn(instructions, fullBeats);
    //     this.writeEighthPausesIn(instructions, eighths);

    //     if (timeDiffFromInt < 0.005) {
    //         this.writeWaitUntilNextStopIn(instructions, Math.round(timeInSeconds));
    //     }
    // }

    private getPause(time: number): Instruction[] {
        const fullBeats = Math.floor(time);
        const eighths = (time % 1);
        const instructions: Instruction[] = [];

        this.writeFullBeatPausesIn(instructions, fullBeats);
        this.writeEighthPausesIn(instructions, eighths);

        return instructions;
    }

    private getEighthPauses(length: number): Instruction[] {
        const instructions: Instruction[] = [];
        this.writeEighthPausesIn(instructions, length);
        return instructions;
    }

    // private writeWaitUntilNextStopIn(instructions: Instruction[], time: number): void {
    //     if (this.workingTrackIndex === undefined) { throw new Error("No working track"); }
    //     instructions.push(new LetLine(this.tracksOwn(this.v.nextStop), time));
    //     instructions.push(new Instruction(Command.gosub, this.declaredWaitUntilNextStops[this.workingTrackIndex]))
    // }

    private writeFullBeatPausesIn(instructions: Instruction[], beats: number): void {
        if (!beats) { return; }
        if (beats < this.config.maxTimesRepeated) {
            for (let i = 0; i < beats; i++) {
                instructions.push(new Instruction(Command.pause, this.V.beatLength));
            }
        } else {
            const temp = this.tracksOwn(this.v.temp);
            instructions.push(new LetLine(temp, this.V.beatLength + " * " + beats));
            instructions.push(new Instruction(Command.pause, temp));
        }
    }

    private writeEighthPausesIn(instructions: Instruction[], length: number): void {
        if (!length) { return; }
        const timeVar = this.getEighthTimeVar(length);
        instructions.push(new Instruction(Command.pause, timeVar));
    }

    private getEighthTimeVar(length: number): TimeVar {
        let time = this.declaredTimeVars.find(e => e.length === length);
        if (!time) {
            time = new TimeVar(length * this.inBetweens, this.inBetweens, this.beatLength, this.config.timeOffset);
            this.declaredTimeVars.push(time);
            this.components.push(time);
        }
        return time;
    }

    private tracksOwn(name: string) {
        if (this.workingTrackIndex === undefined) { throw new Error("No working track"); }
        return name + (this.workingTrackIndex + 1);
    }

    private expandPauses(): void {
        for (let i = 0; i < this.tracks.length; i++) {
            this.workingTrackIndex = i;
            this.expandPausesInLines(this.lines[i]);
        }
        this.workingTrackIndex = undefined;

        for (let i = 0; i < this.fnDefs.length; i++) {
            const fnDef = this.fnDefs[i];
            this.workingTrackIndex = fnDef.boundTrack;
            this.expandPausesInLines(fnDef.instructions as ProgramLine[]);
        }

        for (let i = this.declaredTimeVars.length - 1; i >= 0; i--) {
            const timeVar = this.declaredTimeVars[i];
            if (timeVar.length >= 1) {
                this.declaredTimeVars.splice(i, 1);
                this.components.splice(this.components.indexOf(timeVar), 1);
            }
        }
    }

    private expandPausesInLines(lines: ProgramLine[]): void {
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            if (
                line instanceof Instruction &&
                line.command === Command.pause &&
                line.argument instanceof TimeVar &&
                line.argument.length >= 1
            ) {
                lines.splice(i, 1, ...this.getPause(line.argument.length));
            }
        }
    }

    private combineRepeatingCode(): void {
        for (const lines of this.lines) {
            this.combineRepeating(lines);
        }

        for (const fn of this.fnDefs) {
            this.combineRepeating(fn.instructions as Instruction[]);
        }
    }

    private sortComponents(): void {
        this.components.sort((a, b) => a.name < b.name ? -1 : 1);
    }

    private setupComponents(): void {
        for (const component of this.components) {
            component.appendToDefines(this.defines);
            component.appendToSymbols(this.symbolLines);
            component.appendToLets(this.letLines);
            component.appendToLines(this.lines);
            component.appendToFnDefs(this.fnDefs);
        }
    }

    private sortSymbolLines(): void {
        this.symbolLines = this.symbolLines
            .sort((a, b) => a.name < b.name ? -1 : 1)
            .sort((a, b) => a.order - b.order);
    }

    private assignVariableSymbolValues(): void {
        let curr = 0;
        for (const symbol of this.symbolLines) {
            if (symbol instanceof VariableSymbolLine) {
                curr = symbol.setPtr(curr);
            }
        }
    }

    private combineRepeating(lines: ProgramLine[]): void {
        this.keepCombiningRepeatingToFunctionsUntilCant(lines);
        this.combineRepeatingToLoops(lines);
    }

    private keepCombiningRepeatingToFunctionsUntilCant(lines: ProgramLine[]) {
        do { this.combineRepeatingToFunctions(lines); } while (this.didCombineIntoFunction);
    }

    private combineRepeatingToFunctions(lines: ProgramLine[]): void {
        const stree = new SuffixTree(lines);
        const repeating = stree.getLongestNonOverlappingRepeating() as ProgramLine[];
        const timesRepeated = arrayFindTimesRepeated(lines, repeating);
        if (
            repeating.length > 2 ||
            (repeating.length > 1 && timesRepeated > this.config.maxTimesRepeated)
        ) {
            const fnDef = new FnDef(this.tracksOwn(this.v.genericFnName) + "_" + (this.functionNameCounter++), repeating, undefined, this.workingTrackIndex);
            arrayFindReplaceAll(lines, repeating, new Instruction(Command.gosub, fnDef));
            this.fnDefs.push(fnDef);
            this.combineRepeating(fnDef.instructions as ProgramLine[]);
            this.didCombineIntoFunction = true;
            return;
        }
        this.didCombineIntoFunction = false;
    }

    private combineRepeatingToLoops(instructions: ProgramLine[]): void {
        let startRepeatingIndex: number | undefined;
        let lastLine: ProgramLine | undefined;


        for (let i = instructions.length - 1; i >= 0; i--) {
            if (instructions[i].equals && instructions[i].equals(lastLine)) {
                if (startRepeatingIndex === undefined) {
                    startRepeatingIndex = i + 1;
                }
            } else {
                if (startRepeatingIndex !== undefined) {
                    let repeatLength = startRepeatingIndex - i;
                    if (repeatLength >= this.config.maxTimesRepeated) {
                        instructions.splice(
                            startRepeatingIndex - repeatLength + 1,
                            repeatLength,
                            new ForLoop(
                                repeatLength,
                                this.tracksOwn(this.v.i),
                                lastLine as ProgramLine,
                                this.stacks[this.workingTrackIndex as number]
                            )
                        );
                    }
                }
                startRepeatingIndex = undefined;
            }

            lastLine = instructions[i];
        }
    }

    private removeUnusedFunctions(): void {
        const usedFunctions = new Set<string>();
        for (let i = 0; i < this.lines.length; i++) {
            this.findUsedFunctions(this.lines[i], usedFunctions);
        }

        for (let i = this.fnDefs.length - 1; i >= 0; i--) {
            const fnDef = this.fnDefs[i];
            if (!usedFunctions.has(fnDef.name)) {
                this.fnDefs.splice(i, 1);
            }
        }
    }

    private findUsedFunctions(lines: (string | ProgramLine)[], usedFunctions: Set<string>): void {
        for (const line of lines) {
            if (line instanceof Instruction && line.command === Command.gosub) {
                if (line.argument instanceof FnDef) {
                    if (!usedFunctions.has(line.argument.name)) {
                        usedFunctions.add(line.argument.name);
                        this.findUsedFunctions(line.argument.instructions, usedFunctions);
                    }
                } else if (line.argument) {
                    usedFunctions.add(line.argument.toString())
                }
            } else if (line instanceof ForLoop) {
                if (line.stack) {
                    for (const name of line.stack.fnNames) {
                        usedFunctions.add(name);
                    }
                }

                this.findUsedFunctions([line.instruction], usedFunctions);
            }
        }
    }

    private removeUnnecessaryStackCalls(): void {
        for (let i = 0; i < this.lines.length; i++) {
            this.removeUnnecessaryStackCallsInLines(this.lines[i]);
        }
    }

    private removeUnnecessaryStackCallsInLines(lines: (ProgramLine | string)[]): void {
        for (const line of lines) {
            if (line instanceof ForLoop) {
                if (lineIsCallToFunctionWithReference(line.instruction)) {
                    if (!this.functionHasForLoop(line.instruction.argument)) {
                        line.stack = undefined;
                    }
                    this.removeUnnecessaryStackCallsInLines(line.instruction.argument.instructions);
                } else {
                    line.stack = undefined;
                }
            } else if (lineIsCallToFunctionWithReference(line)) {
                this.removeUnnecessaryStackCallsInLines(line.argument.instructions);
            }
        }
    }

    private functionHasForLoop(fn: FnDef): boolean {
        for (const line of fn.instructions) {
            if (line instanceof ForLoop) {
                return true;
            } else if (lineIsCallToFunctionWithReference(line)) {
                if (this.functionHasForLoop(line.argument)) {
                    return true;
                }
            }
        }

        return false;
    }

    private inlineFunctionsUsedOnlyOnce(): void {
        const countingMap = new CountingMap();

        for (const lines of this.lines) {
            this.countTimesFunctionUsed(lines, countingMap);
        }

        for (const fnDef of this.fnDefs) {
            const timesUsed = countingMap.get(fnDef.name);
            if (!timesUsed) { continue; }
            if (timesUsed === 1) {
                fnDef.inline = true;
            }
        }
    }

    private countTimesFunctionUsed(lines: (string | ProgramLine)[], timesUsedMap: CountingMap): void {
        for (const line of lines) {
            if (line instanceof Instruction && line.command === Command.gosub) {
                if (line.argument instanceof FnDef) {
                    if (!timesUsedMap.has(line.argument.name)) {
                        this.countTimesFunctionUsed(line.argument.instructions, timesUsedMap);
                    }
                    timesUsedMap.increment(line.argument.name);
                } else if (line.argument) {
                    timesUsedMap.increment(line.argument.toString())
                }
            } else if (line instanceof ForLoop) {
                if (line.stack) {
                    for (const name of line.stack.fnNames) {
                        timesUsedMap.increment(name);
                    }
                }

                this.countTimesFunctionUsed([line.instruction], timesUsedMap);
            }
        }
    }
}

function arrayFindReplaceAll(array: Equalable[], find: Equalable[], replace: Equalable): void {
    if (find.length === 0) { throw new Error("Attempting to find empty array"); }

    startIndex: for (let i = 0; i < array.length - find.length; i++) {
        for (let j = 0; j < find.length; j++) {
            if (!array[i + j].equals(find[j])) { continue startIndex; }
        }

        // found!
        array.splice(i, find.length, replace);
    }
}

function arrayFindTimesRepeated(array: Equalable[], find: Equalable[]): number {
    if (find.length <= 0) { return 0; }

    let count = 0;
    startIndex: for (let i = 0; i < array.length - find.length; i++) {
        for (let j = 0; j < find.length; j++) {
            if (!array[i + j].equals(find[j])) { continue startIndex; }
        }

        count++;
        i += find.length - 1;
    }

    return count;
}


const pins = ["C.0", "C.1", "B.7"];

const note = `
Created by Leone Huang
LEDs blink in sync with Bon Jovi - Livin' On A Prayer, starting at 0:00 to 2:22
https://www.youtube.com/watch?v=lDK9QqIzhwk

Pins used:
  - C.0: vocals
  - C.1: synth-like, guitar, and cymbals
  - B.7: drums
`;

export default function compile(tracks: Track[], inBetweens: number, bpm: number, labels: string[]): string {
    const prog = new Program(tracks, inBetweens, bpm, labels);
    console.log(prog);
    return prog.compile();
}

