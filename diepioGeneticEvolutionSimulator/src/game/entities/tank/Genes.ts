import { TankClass, basicTank } from "./TankClass";

/**
 * Tank genes, all `number` properties in range [0..1]
 */
class Genes {
    /** Max value of a gene, safeguard */
    private static readonly max = 0.99;
    /** Min value of a gene, safeguard */
    private static readonly min = 0.01;
    /** Max mutation */
    private static readonly baseMutationRate = 0.3;

    /** How close until they start walking towards the shape */
    public range: number;
    /** How close until they start firing */
    public idealDistance: number;
    /** How close before they back off */
    public comfortableDistance: number;

    /** Chance to attack another tank */
    public aggression: number;
    /** How much randomness is applied to the intended direction of fire */
    public accuracy: number;

    /** Chance to spec into health regeneration on level up */
    public healthRegeneration: number;
    /** Chance to spec into max health on level up */
    public maxHealth: number;
    /** Chance to spec into body damage on level up */
    public bodyDamage: number;
    /** Chance to spec into bullet speed on level up */
    public bulletSpeed: number;
    /** Chance to spec into bullet penetration on level up */
    public bulletPenetration: number;
    /** Chance to spec into bullet damage on level up */
    public bulletDamage: number;
    /** Chance to spec into reload on level up */
    public reload: number;
    /** Chance to spec into movement speed on level up */
    public movementSpeed: number;

    /** Level they must reach before reproducing */
    public levelToReproduction: number;
    /** How long until the baby switches teams? And how much the mother gives to the child */
    public care: number;
    /** Mutation rate for future mutations */
    public mutationRate: number;

    /** Tank class */
    public class: TankClass;

    constructor(genes?: Genes) {
        if (genes) {
            this.range = genes.range;
            this.idealDistance = genes.idealDistance;
            this.comfortableDistance = genes.comfortableDistance;
            this.aggression = genes.aggression;
            this.accuracy = genes.accuracy;
            this.healthRegeneration = genes.healthRegeneration;
            this.maxHealth = genes.maxHealth;
            this.bodyDamage = genes.bodyDamage;
            this.bulletSpeed = genes.bulletSpeed;
            this.bulletPenetration = genes.bulletPenetration;
            this.bulletDamage = genes.bulletDamage;
            this.reload = genes.reload;
            this.movementSpeed = genes.movementSpeed;
            this.levelToReproduction = genes.levelToReproduction;
            this.care = genes.care;
            this.mutationRate = genes.mutationRate;
            this.class = genes.class;
        } else {
            this.range = Math.random();
            this.idealDistance = Math.random();
            this.comfortableDistance = Math.random();
            this.aggression = Math.random();
            this.accuracy = Math.random();
            this.healthRegeneration = Math.random();
            this.maxHealth = Math.random();
            this.bodyDamage = Math.random();
            this.bulletSpeed = Math.random();
            this.bulletPenetration = Math.random();
            this.bulletDamage = Math.random();
            this.reload = Math.random();
            this.movementSpeed = Math.random();
            this.levelToReproduction = Math.random();
            this.care = Math.random();
            this.mutationRate = Math.random();
            this.class = basicTank;
        }
    }

    public static combineAndMutate(a: Genes, b: Genes) {
        const copy = new Genes(a);

        const genes = Object.keys(copy) as (keyof Genes)[];
        for (const gene of genes) {
            copy.mixAndMutateGene(gene, b[gene]);
        }

        return copy;
    }

    public copyAndMutate(): Genes {
        const newGenes = new Genes(this);

        const genes = Object.keys(newGenes) as (keyof Genes)[];
        for (const gene of genes) {
            newGenes.mutateGene(gene);
        }

        return newGenes;
    }

    /**
     * Calculates the distance between genes
     */
    public compare(other: Genes): number {
        const genes = Object.keys(other) as (keyof Genes)[];
        let sum = 0;

        for (const gene of genes) {
            const a = this[gene];
            const b = other[gene];
            if (typeof a === "number") {
                const d = (a - (b as number));
                sum += d * d;
            } else if (gene === "class") {
                // do nothing, for now
                // todo
            }
        }

        return Math.sqrt(sum);
    }

    protected mutateGene<T extends keyof Genes>(gene: T): void {
        const val = this[gene];
        if (typeof val === "number") {
            this[gene] = this.calcMutateFromValue(val) as any;
        } else if (gene === "class") {
            this.class = this.class.cloneAndMutate(this.mutationRate) as any;
        }
    }

    protected mixAndMutateGene<T extends keyof Genes>(gene: T, otherVal: Genes[T]): void {
        const thisVal = this[gene];
        if (typeof thisVal === "number") {
            this[gene] = this.calcMutateFromValue((thisVal + (otherVal as number)) / 2) as any;
        } else if (gene === "class") {
            this.class = (thisVal as TankClass).mixAndMutate(otherVal as TankClass, this.mutationRate);
        }
    }

    private calcMutateFromValue(currValue: number): number {
        const rate = this.mutationRate * Genes.baseMutationRate;
        if (Math.random() < rate) {
            const newValue = currValue +
                (Math.random() - 0.5) * 2 * this.mutationRate * Genes.baseMutationRate;
            if (newValue >= Genes.max) { return Genes.max; }
            else if (newValue <= Genes.min) { return Genes.min; }
            return newValue;
        } else {
            return currValue;
        }
    }
}

export default Genes;