import Tank from "./Tank";
import Game from "../../Game";
import Genes from "./Genes";
import Polygon from "../Polygon";
import Entity from "../../Entity";
import OpenSimplexNoise from "open-simplex-noise";
import Bullet from "../Bullet";

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
        this.updatePolygonTarget();
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
        if (!this.target) { return [this.vx, this.vy]; }
        return [this.target.x - this.x, this.target.y - this.y];
    }

    protected getTriggered(): boolean {
        if (this.target) {
            return this.inFiringRange;
        } else {
            return false;
        }
    }

    private updatePolygonTarget(): void {
        if (this.target && !this.target.destoryed) { return; }

        let range = this.range * this.genes.range;
        range *= range;

        for (const entity of this.game.entities) {
            if (entity.teamID === this.teamID) { continue; }
            const dx = entity.x - this.x;
            const dy = entity.y - this.y;

            if (dx * dx + dy * dy > range) { continue; }

            if (entity instanceof Tank || entity instanceof Bullet) {
                if (Math.random() < this.genes.aggression) {
                    this.target = entity;
                    return;
                }
            } else {
                this.target = entity;
                return;
            }
        }

        this.target = undefined;
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
}

export default GeneticTank;