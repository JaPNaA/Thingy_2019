class TankCanon {
    public readonly power: number;
    public readonly bulletPower: number;
    public readonly unstableness: number;
    public warmth: number = 0;

    private static readonly maxAccuracyLength: number = 1.5;
    private static readonly baseWidth: number = 0.75;

    constructor(
        public readonly angle: number = 0,
        public readonly width: number = TankCanon.baseWidth,
        public readonly length: number = 0.85,
        public readonly offset: number = 0,
        public readonly cooldown: number = 1,
        public readonly visible: boolean = true
    ) {
        const widthNorm = width / TankCanon.baseWidth;
        this.bulletPower = widthNorm * widthNorm;
        this.cooldown *= widthNorm;
        this.power = this.bulletPower / cooldown;
        this.unstableness = Math.min(Math.max(
            1 - length / TankCanon.maxAccuracyLength,
            0), 1
        );
    }

    public clone(): TankCanon {
        return new TankCanon(
            this.angle,
            this.width,
            this.length,
            this.offset,
            this.cooldown,
            this.visible
        );
    }

    public mutate(): void {
        //
    }
}

export default TankCanon;