import TankCanon from "./TankCanon";

class TankClass {
    public readonly canons: TankCanon[];
    public readonly powerDivider: number;

    private static readonly canonNumberChangeChance: number = 0.6;

    constructor(canons: TankCanon[]) {
        this.canons = canons;

        this.powerDivider = 0;
        for (const canon of canons) {
            this.powerDivider += canon.power;
        }
        this.powerDivider = 1 + Math.log(this.powerDivider);
    }

    public clone(): TankClass {
        const newCanons = [];
        for (const canon of this.canons) {
            newCanons.push(canon.clone());
        }
        return new TankClass(newCanons);
    }

    public cloneAndMutate(geneMutationRate: number): TankClass {
        const mutationRate = geneMutationRate * TankClass.canonNumberChangeChance;
        const newCanons = [];
        let addCanonChance = 1 / (this.canons.length + 1);

        for (const canon of this.canons) {
            const rand = Math.random();

            if (rand < mutationRate) {
                if (rand < mutationRate * addCanonChance) {
                    newCanons.push(canon.cloneAndMutate(geneMutationRate));
                    newCanons.push(canon.cloneAndMutate(geneMutationRate));
                } // else: lose canon
            } else {
                newCanons.push(canon.cloneAndMutate(geneMutationRate));
            }
        }

        return new TankClass(newCanons);
    }

    public mixAndMutate(other: TankClass, geneMutationRate: number): TankClass {
        const canons: TankCanon[] = [];
        const avgNumberOfCanons = (other.canons.length + this.canons.length) / 2;
        const numberOfCanons = Math.random() < 0.5 ? Math.floor(avgNumberOfCanons) : Math.ceil(avgNumberOfCanons);

        for (let i = 0; i < numberOfCanons; i++) {
            if (this.canons[i]) {
                if (other.canons[i]) {
                    canons.push(
                        Math.random() < 0.5 ?
                            this.canons[i] : other.canons[i]
                    );
                } else {
                    canons.push(this.canons[i]);
                }
            } else {
                canons.push(other.canons[i]);
            }
        }

        return new TankClass(canons).cloneAndMutate(geneMutationRate);
    }
}

const basicTank = new TankClass([
    new TankCanon(0, 0.75, 0.85, 0, 1, true)
]);

export { TankClass, basicTank };