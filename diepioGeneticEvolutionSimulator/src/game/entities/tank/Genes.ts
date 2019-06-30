import { TankClass, tankClass } from "./Classes";

/**
 * Tank genes, all `number` properties in range [0..1]
 */
class Genes {
    /** How close until they start walking towards the shape */
    public range: number;
    /** How close until they start firing */
    public distanceBeforeFiring: number;
    /** Chance to attack another tank */
    public aggression: number;

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
    public pointsToReproduction: number;
    /** Mutation rate for future mutations */
    public mutationRate: number;

    /** Tank class */
    public class: TankClass;

    constructor(genes?: Genes) {
        if (genes) {
            this.range = genes.range;
            this.distanceBeforeFiring = genes.distanceBeforeFiring;
            this.aggression = genes.aggression;
            this.healthRegeneration = genes.healthRegeneration;
            this.maxHealth = genes.maxHealth;
            this.bodyDamage = genes.bodyDamage;
            this.bulletSpeed = genes.bulletSpeed;
            this.bulletPenetration = genes.bulletPenetration;
            this.bulletDamage = genes.bulletDamage;
            this.reload = genes.reload;
            this.movementSpeed = genes.movementSpeed;
            this.pointsToReproduction = genes.pointsToReproduction;
            this.mutationRate = genes.mutationRate;
            this.class = genes.class;
        } else {
            this.range = Math.random();
            this.distanceBeforeFiring = Math.random();
            this.aggression = Math.random();
            this.healthRegeneration = Math.random();
            this.maxHealth = Math.random();
            this.bodyDamage = Math.random();
            this.bulletSpeed = Math.random();
            this.bulletPenetration = Math.random();
            this.bulletDamage = Math.random();
            this.reload = Math.random();
            this.movementSpeed = Math.random();
            this.pointsToReproduction = Math.random();
            this.mutationRate = Math.random();
            this.class = tankClass.basic;
        }
    }

    public copyAndMutate(): Genes {
        const newGenes = new Genes(this);

        const genes = Object.keys(newGenes) as (keyof Genes)[];
        for (const gene of genes) {
            newGenes.mutateGene(gene);
        }

        return newGenes;
    }

    protected mutateGene<T extends keyof Genes>(gene: T): void {
        if (gene === "class") {
            // do nothing, for now
            // todo
        } else {
            this[gene] = this.calcMutateFromValue(this[gene] as number) as any;
        }
    }

    private calcMutateFromValue(currValue: number): number {
        const newValue = currValue +
            (Math.random() - 0.5) * 2 * this.mutationRate;
        if (newValue >= 1) { return 1; }
        else if (newValue <= 0) { return 0; }
        return newValue;
    }
}

export default Genes;