import TankCanon from "./TankCanon";

class TankClass {
    public canons: TankCanon[];
    public bulletSpeedBoost: number;
    public rangeBoost: number;

    constructor(canons: TankCanon[], options?: {
        bulletSpeedBoost?: number,
        rangeBoost?: number
    }) {
        this.canons = canons;
        this.bulletSpeedBoost = 1;
        this.rangeBoost = 1;

        if (options) {
            if (options.bulletSpeedBoost) {
                this.bulletSpeedBoost = options.bulletSpeedBoost
            }
            if (options.rangeBoost) {
                this.rangeBoost = options.rangeBoost;
            }
        }
    }
}

const tankClass = {
    basic: new TankClass([new TankCanon(0, 18, 20, 0, 1)])
};

export { TankClass, tankClass };