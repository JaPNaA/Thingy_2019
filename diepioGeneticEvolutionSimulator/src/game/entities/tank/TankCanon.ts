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

    public cloneAndMutate(genesMutationRate: number): TankCanon {
        const rate = genesMutationRate * 0.3;
        let angle = this.angle;
        let width = this.width;
        let length = this.length;
        let offset = this.offset;
        let cooldown = this.cooldown;

        if (Math.random() < rate) {
            angle += (Math.random() - 0.5) * Math.PI * 0.5;
            angle %= Math.PI * 2;
        }
        if (Math.random() < rate) {
            width = Math.max(Math.min(width + (Math.random() - 0.5) * 0.2, 2), 0.5);
        }
        if (Math.random() < rate) {
            length = Math.max(Math.min(length + (Math.random() - 0.5) * 0.2, 2), 0.2);
        }
        if (Math.random() < rate) {
            offset = Math.max(Math.min(offset + (Math.random() - 0.5) * 0.3, 0.9), 0);
            offset %= 1;
        }
        if (Math.random() < rate) {
            cooldown = Math.max(cooldown + (Math.random() - 0.5) * 0.2, 0.5);
        }

        return new TankCanon(angle, width, length, offset, cooldown, this.visible);
    }
}

export default TankCanon;