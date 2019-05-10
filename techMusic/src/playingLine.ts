import Track from "./track.js";

class PlayingLine {
    public bpm: number;
    public beatLength: number;
    public x: number = 0;
    public playing: boolean = false;
    private then: number = 0;
    public audio: HTMLAudioElement;
    public time: HTMLDivElement;

    constructor(pathToAudio: string, bpm: number, timeElm: HTMLDivElement) {
        this.bpm = bpm;
        this.beatLength = 60000 / this.bpm;
        this.time = timeElm;
        this.audio = new Audio(pathToAudio);
        this.audio.preload = "auto";
        console.log(this.audio);
    }

    public play() {
        this.audio.play();
        this.playing = true;
        this.then = performance.now();
        this.syncAudio();
    }

    public stop() {
        this.audio.pause();
        this.playing = false;
    }

    public back() {
        if (this.x % 1 < 0.2) {
            this.x = Math.floor(this.x) - 1;
        } else {
            this.x = Math.floor(this.x);
        }
        if (this.x < 0) { this.x = 0; }
        this.syncAudio();
    }

    public forwards() {
        this.x = Math.floor(this.x) + 1;
        this.syncAudio();
    }

    public setX(x: number): void {
        this.x = x;
        this.syncAudio();
    }

    public syncAudio() {
        this.audio.pause();
        const time = this.x * this.beatLength / 1000;
        this.audio.currentTime = time;
        if (this.playing) { this.audio.play(); }
    }

    public togglePlaying() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }
    }

    public render(X: CanvasRenderingContext2D) {
        X.fillStyle = "#dd0000";
        X.fillRect(this.x, 0, 0.05, X.canvas.height);
        this.tick();
    }

    public getStates(tracks: Track[]): boolean[] {
        const arr: boolean[] = [];
        this.time.innerText = Math.floor(this.audio.currentTime * 1000).toString();

        for (let i = 0; i < tracks.length; i++) {
            arr[i] = tracks[i].getBlockIndexAt(this.x) >= 0;
        }

        return arr;
    }

    private tick() {
        if (!this.playing) { return; }
        const now = performance.now();
        const dt = now - this.then;
        this.then = now;
        this.x += (dt / 60000) * this.bpm;
    }

}

export default PlayingLine;