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

    public clone(): TankClass {
        const newCanons = [];
        for (const canon of this.canons) {
            newCanons.push(canon.clone());
        }
        return new TankClass(newCanons, {
            bulletSpeedBoost: this.bulletSpeedBoost,
            rangeBoost: this.rangeBoost
        });
    }
}

const basicTank = new TankClass([
    new TankCanon(0, 0.75, 0.85, 0, 1)
]);

export { TankClass, basicTank };