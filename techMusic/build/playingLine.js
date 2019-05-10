class PlayingLine {
    constructor(pathToAudio, bpm, timeElm) {
        this.x = 0;
        this.playing = false;
        this.then = 0;
        this.bpm = bpm;
        this.beatLength = 60000 / this.bpm;
        this.time = timeElm;
        this.audio = new Audio(pathToAudio);
        this.audio.preload = "auto";
        console.log(this.audio);
    }
    play() {
        this.audio.play();
        this.playing = true;
        this.then = performance.now();
        this.syncAudio();
    }
    stop() {
        this.audio.pause();
        this.playing = false;
    }
    back() {
        if (this.x % 1 < 0.2) {
            this.x = Math.floor(this.x) - 1;
        }
        else {
            this.x = Math.floor(this.x);
        }
        if (this.x < 0) {
            this.x = 0;
        }
        this.syncAudio();
    }
    forwards() {
        this.x = Math.floor(this.x) + 1;
        this.syncAudio();
    }
    setX(x) {
        this.x = x;
        this.syncAudio();
    }
    syncAudio() {
        this.audio.pause();
        const time = this.x * this.beatLength / 1000;
        this.audio.currentTime = time;
        if (this.playing) {
            this.audio.play();
        }
    }
    togglePlaying() {
        if (this.playing) {
            this.stop();
        }
        else {
            this.play();
        }
    }
    render(X) {
        X.fillStyle = "#dd0000";
        X.fillRect(this.x, 0, 0.05, X.canvas.height);
        this.tick();
    }
    getStates(tracks) {
        const arr = [];
        this.time.innerText = Math.floor(this.audio.currentTime * 1000).toString();
        for (let i = 0; i < tracks.length; i++) {
            arr[i] = tracks[i].getBlockIndexAt(this.x) >= 0;
        }
        return arr;
    }
    tick() {
        if (!this.playing) {
            return;
        }
        const now = performance.now();
        const dt = now - this.then;
        this.then = now;
        this.x += (dt / 60000) * this.bpm;
    }
}
export default PlayingLine;
