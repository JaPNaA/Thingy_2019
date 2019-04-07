class AutoKeyTimer {
    public holding: boolean;
    public times: number;

    private autoActive: boolean;
    private autoInterval: number;
    private autoDelay: number;
    private time: number;

    constructor(autoDelay: number, autoInterval: number) {
        this.autoDelay = autoDelay;
        this.autoInterval = autoInterval;
        this.autoActive = false;
        this.holding = false;
        this.time = 0;
        this.times = 0;
    }

    public update(deltaTime: number): void {
        if (!this.holding) { return; }
        this.time += deltaTime;

        if (this.autoActive) {
            this.times += Math.floor(this.time / this.autoInterval);
            this.time %= this.autoInterval;
        } else {
            if (this.time > this.autoDelay) {
                this.autoActive = true;
                this.time -= this.autoDelay;
            }
        }
    }

    public startHoldIfNotAlready() {
        if (!this.holding) {
            this.startHold();
        }
    }

    public startHold(): void {
        this.holding = true;
        this.time = 0;
        this.times = 1;
    }

    public stopHold(): void {
        this.holding = false;
        this.autoActive = false;
    }
}

export default AutoKeyTimer;