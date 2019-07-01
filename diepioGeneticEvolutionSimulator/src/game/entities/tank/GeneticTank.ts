import Tank from "./Tank";
import Game from "../../Game";
import Genes from "./Genes";
import Polygon from "../Polygon";
import Entity from "../../Entity";

class GeneticTank extends Tank {
    private genes: Genes;
    private target?: Entity;
    private inFiringRange: boolean;

    constructor(game: Game, x: number, y: number, genes: Genes) {
        super(game, x, y);
        this.genes = genes;
        this.inFiringRange = false;
    }

    public tick(deltaTime: number): void {
        this.updatePolygonTarget();
        this.updateInRange();
        super.tick(deltaTime);
    }

    protected getMovement(): [number, number] {
        if (!this.target || this.inFiringRange) { return [0, 0]; }
        return [this.target.x - this.x, this.target.y - this.y];
    }

    protected getDirection(): [number, number] {
        if (!this.target) { return [0, 0]; }
        return [this.target.x - this.x, this.target.y - this.y];
    }

    protected getTriggered(): boolean {
        return this.inFiringRange;
    }

    private updatePolygonTarget(): void {
        if (this.target && !this.target.destoryed) { return; }

        let range = this.range * this.genes.range;
        range *= range;

        for (const entity of this.game.entities) {
            if (entity.x * entity.x + entity.y * entity.y > range) { continue; }
            if (entity instanceof Polygon) {
                this.target = entity;
                return;
            } else if (entity instanceof Tank) {
                if (Math.random() < this.genes.aggression) {
                    this.target = entity;
                    return;
                }
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
}

export default GeneticTank;