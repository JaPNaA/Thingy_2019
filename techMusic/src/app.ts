import Track from "./track.js";
import Block from "./block.js";
import PlayingLine from "./playingLine.js";
import compile from "./compile/compile.js";
import getTracksLength from "./compile/compile/utils/getTracksLength.js";

class App {
    private tracks: Track[] = [];
    private canvas: HTMLCanvasElement;
    private labelsElm: HTMLDivElement;
    private timeElm: HTMLDivElement;
    private X: CanvasRenderingContext2D;
    private playingLine: PlayingLine;

    private workingBlock?: Block;
    private workingTrack?: Track;
    private startX: number = 0;

    private scaleX: number = 64;
    private scaleY: number = 64;
    private translateX: number = 0;

    private inBetweens: number = 8;

    constructor(private trackLabels: string[], pathToAudio: string, bpm: number) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1280 - 128;
        this.canvas.height = 720;
        this.X = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.timeElm = document.createElement("div");
        document.body.appendChild(this.canvas);

        this.labelsElm = document.createElement("div");
        this.labelsElm.classList.add("labels");
        document.body.appendChild(this.labelsElm);

        this.playingLine = new PlayingLine(pathToAudio, bpm, this.timeElm);

        for (const label of trackLabels) {
            this.tracks.push(new Track(label, this.labelsElm, this.scaleY));
        }

        this.setup();
        this.renderLoop();
    }

    private setup() {
        addEventListener("mousedown", (e) => {
            if (this.workingBlock || e.button !== 0) { return; }
            const x = this.applyTransformX(e.clientX);
            const y = this.applyTransformY(e.clientY);
            this.workingTrack = this.tracks[y];

            if (!this.workingTrack) { return; }

            this.workingBlock = new Block(x, 0);
            this.workingTrack.addBlock(this.workingBlock);
            this.startX = x;
        });

        addEventListener("mousemove", (e) => {
            if (!this.workingBlock || !this.workingTrack) { return; }
            this.updateWorkingBlockLength(e.clientX);
        });

        addEventListener("mouseup", (e) => {
            if (!this.workingBlock || !this.workingTrack) { return; }
            this.updateWorkingBlockLength(e.clientX);
            if (this.workingBlock.length === 0) {
                this.workingTrack.removeBlock(this.workingBlock);
            }
            this.workingBlock = undefined;
        });

        addEventListener("wheel", (e) => {
            if ((e.target as HTMLElement).tagName === 'TEXTAREA') { return; }

            if (e.deltaY > 0) {
                this.translateX++;
            } else {
                this.translateX--;
            }

            if (this.translateX < 0) { this.translateX = 0; }
        });

        addEventListener("auxclick", (e_) => {
            const e = e_ as MouseEvent;

            const x = this.applyTransformX(e.clientX);
            const y = this.applyTransformY(e.clientY);

            if (this.tracks[y]) {
                this.tracks[y].removeBlockAt(x);
            }
        });

        addEventListener("contextmenu", (e) => e.preventDefault());

        addEventListener("keydown", (e) => {
            if (e.keyCode === 32) {
                e.preventDefault();
                this.playingLine.togglePlaying();
            } else if (e.keyCode === 37) {
                // left
                e.preventDefault();
                this.playingLine.back();
                this.goToPlayingLine();
            } else if (e.keyCode === 39) {
                // right
                e.preventDefault();
                this.playingLine.forwards();
                this.goToPlayingLine();
            } else if (e.keyCode === 112) {
                // f1
                e.preventDefault();
                this.showSave();
            } else if (e.keyCode === 113) {
                // f2
                e.preventDefault();
                if (confirm("Delete all?")) {
                    for (const track of this.tracks) {
                        track.deleteAll();
                    }
                }
            } else if (e.keyCode === 114) {
                // f3
                e.preventDefault();
                this.showCompiled();
            } else if (e.keyCode === 115) {
                // f4
                e.preventDefault();
                const data = prompt("Enter data");
                if (data) {
                    for (const track of this.tracks) {
                        track.deleteAll();
                    }
                    this.restoreFrom(data);
                }
            } else if (e.keyCode === 36) {
                // home
                e.preventDefault();
                this.playingLine.setX(0);
                this.goToPlayingLine();
            } else if (e.keyCode === 35) {
                // end
                e.preventDefault();
                this.playingLine.setX(getTracksLength(this.tracks));
                this.goToPlayingLine();
            }
        });

        setInterval(() => {
            this.save();
        }, 120000);

        addEventListener("beforeunload", () => {
            this.save();
        });

        if (localStorage.techMusicStorage) {
            this.restoreFrom(localStorage.techMusicStorage);
        }


        this.timeElm.id = "time";
        this.labelsElm.appendChild(this.timeElm);
    }

    private restoreFrom(str: string): void {
        let tracks = JSON.parse(str) as [number, number][][];

        for (let i = 0; i < tracks.length; i++) {
            this.tracks[i].restoreFrom(tracks[i]);
        }
    }

    private save() {
        localStorage.techMusicStorage = this.serialize();
    }

    private showSave() {
        this.show(this.serialize());
    }

    private showCompiled() {
        if (this.hasOtherShows()) {
            this.removeAShow();
            return;
        }

        let then, now, compiled;
        then = performance.now();
        compiled = compile(this.tracks, this.inBetweens, this.playingLine.bpm, this.trackLabels);
        now = performance.now();

        this.show("; compiled in " + Math.round(now - then) + "ms \n\n" + compiled);
    }

    private show(txt: string) {
        if (this.hasOtherShows()) {
            this.removeAShow();
            return;
        }
        const txtA = document.createElement("textarea");
        txtA.spellcheck = false;
        txtA.value = txt;
        txtA.classList.add("save");
        document.body.appendChild(txtA);
    }

    private removeAShow(): void {
        const otherTxtAs = document.getElementsByTagName("textarea");
        if (otherTxtAs[0]) {
            document.body.removeChild(otherTxtAs[0]);
        }
    }

    private hasOtherShows(): boolean {
        const otherTxtAs = document.getElementsByTagName("textarea");
        return otherTxtAs.length > 0;
    }

    private updateWorkingBlockLength(cursorX: number): void {
        if (!this.workingBlock) { throw new Error("no working block"); }

        let length = this.applyTransformX(cursorX) - this.startX;
        if (length < 0) { length = 0 }
        this.workingBlock.length = length;
    }

    private applyTransformX(x: number): number {
        return Math.round((x - 128) / (this.scaleX / this.inBetweens)) / this.inBetweens + this.translateX;
    }

    private applyTransformY(y: number): number {
        return Math.floor(y / (this.scaleY + 8));
    }

    private renderLoop() {
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    }

    private render() {
        this.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.X.scale(this.scaleX, 1);

        this.drawGuides();

        this.X.translate(-this.translateX, 0);

        this.X.save();
        for (const track of this.tracks) {
            track.render(this.X);
            this.X.translate(0, 72);
        }
        this.X.restore();

        if (this.playingLine.playing) {
            this.goToPlayingLine();
        }

        this.playingLine.render(this.X);

        const states = this.playingLine.getStates(this.tracks);

        for (let i = 0; i < states.length; i++) {
            this.tracks[i].setActive(states[i]);
        }


        this.X.resetTransform();
    }

    private drawGuides() {
        this.X.fillStyle = "#dddddd";
        for (let i = 0; i < this.canvas.width / this.scaleX; i++) {
            this.X.fillRect(i, 0, 0.025, this.canvas.height);
        }
    }

    private goToPlayingLine() {
        const px = this.playingLine.x - this.translateX;
        if (px < 0 || px > 16) {
            this.translateX = Math.floor(this.playingLine.x) - 3;
        }
        if (this.translateX < 0) { this.translateX = 0; }
    }

    private serialize(): string {
        const arr = [];

        for (const track of this.tracks) {
            arr.push(track.serialize());
        }

        return "[" + arr.join(",") + "]";
    }
}

export default App;