class Timer {
    public delay: number;
    public time: number;
    public count: number;
    public paused: boolean;

    constructor(delay: number) {
        this.delay = delay;
        this.time = 0;
        this.count = 0;
        this.paused = true;
    }

    public start() {
        this.paused = false;
    }

    public update(deltaTime: number) {
        if (this.paused) { return; }

        this.time += deltaTime;
        this.count += Math.floor(this.time / this.delay);
        this.time %= this.delay;
    }

    public stop() {
        this.pause();
        this.time = 0;
    }

    public pause() {
        this.paused = false;
    }
}

export default Timer;