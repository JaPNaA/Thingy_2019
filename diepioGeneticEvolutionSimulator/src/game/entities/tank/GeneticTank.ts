import Tank from "./Tank";
import Game from "../../Game";
import Genes from "./Genes";
import Entity from "../../Entity";
import OpenSimplexNoise from "open-simplex-noise";
import Bullet from "../Bullet";
import TankBuild from "./TankBuild";

class GeneticTank extends Tank {
    private genes: Genes;
    private target?: Entity;
    private inFiringRange: boolean;
    private noise: OpenSimplexNoise;
    private noiseProgress: number;

    constructor(game: Game, x: number, y: number, genes: Genes) {
        super(game, x, y);
        this.genes = genes;
        this.inFiringRange = false;
        this.noise = new OpenSimplexNoise(Math.random() * Number.MAX_SAFE_INTEGER);
        this.noiseProgress = Math.random() * 100;

        this.unstableness = 1 - this.genes.accuracy;
    }

    public tick(deltaTime: number): void {
        this.updateTarget();
        this.updateInRange();
        super.tick(deltaTime);
    }

    protected getMovement(deltaTime: number): [number, number] {
        if (!this.target) {
            return this.wander(deltaTime);
        }
        if (this.inFiringRange) { return [0, 0]; }
        return [this.target.x - this.x, this.target.y - this.y];
    }

    protected getDirection(): [number, number] {
        if (!this.target) { return [this.ax, this.ay]; }
        return [this.target.x - this.x, this.target.y - this.y];
    }

    protected getTriggered(): boolean {
        if (this.target) {
            return this.inFiringRange;
        } else {
            return false;
        }
    }

    protected onLevelUp(): void {
        super.onLevelUp();

        while (!TankBuild.upgrade(
            this.build,
            this.getRandomStatByGenes()
        )) { }

        this.updateStatsWithBuild();
    }

    private updateTarget(): void {
        let rangeSquared = this.range * this.genes.range;
        rangeSquared *= rangeSquared;

        if (
            this.target &&
            !this.target.destoryed &&
            this.getDistSquared(this.target) <= rangeSquared
        ) { return; }


        let closest = undefined;
        let closestDistSquared = Infinity;

        for (let i = 0; i < this.game.entities.length; i++) {
            const entity = this.game.entities[i];
            if (entity.teamID === this.teamID) { continue; }

            const dx = entity.x - this.x;
            const dy = entity.y - this.y;
            const distSquared = dx * dx + dy * dy;

            if (distSquared > closestDistSquared) { continue; }
            if (distSquared > rangeSquared) { continue; }

            if (entity instanceof Tank || entity instanceof Bullet) {
                if (Math.random() < this.genes.aggression) {
                    closest = entity;
                    closestDistSquared = distSquared;
                }
            } else {
                closest = entity;
                closestDistSquared = distSquared;
            }
        }

        this.target = closest;
    }

    private getDistSquared(entity: Entity): number {
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        return dx * dx + dy * dy;
    }


    private updateInRange(): void {
        if (!this.target) {
            this.inFiringRange = false;
            return;
        }

        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const dist = dx * dx + dy * dy;
        let distBeforeFiring = this.genes.distanceBeforeFiring * this.genes.range * this.range;
        distBeforeFiring *= distBeforeFiring;
        this.inFiringRange = dist < distBeforeFiring;
    }

    private wander(deltaTime: number): [number, number] {
        const dx = this.noise.noise2D(this.noiseProgress, this.noiseProgress);
        const dy = this.noise.noise2D(-this.noiseProgress, -this.noiseProgress);
        this.noiseProgress += 0.0001 * deltaTime;

        return [dx, dy];
    }

    private getRandomStatByGenes(): keyof TankBuild {
        let total = 0;
        for (const key of TankBuild.keys) {
            total += this.genes[key];
        }

        let random = Math.random() * total;
        let currVal = 0;
        for (const key of TankBuild.keys) {
            currVal += this.genes[key];
            if (currVal >= random) {
                return key;
            }
        }

        throw new Error("Impossible state");
    }
}

export default GeneticTank;