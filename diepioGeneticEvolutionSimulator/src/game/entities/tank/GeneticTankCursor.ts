import Ticker from "../../engine/Ticker";

class GeneticTankCursor {
    public x: number;
    public y: number;

    private targetX: number;
    private targetY: number;

    private static maxSpeed: number = 1 * Ticker.fixedTime;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
    }

    public setTarget(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    public fixedTick(): void {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const ang = Math.atan2(dy, dx);
        const dist = Math.min(
            Math.sqrt(dx * dx + dy * dy),
            GeneticTankCursor.maxSpeed
        );

        this.x += Math.cos(ang) * dist;
        this.y += Math.sin(ang) * dist;
    }
}

export default GeneticTankCursor;