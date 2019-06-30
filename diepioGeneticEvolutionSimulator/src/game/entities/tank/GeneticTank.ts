import Tank from "./Tank";
import Game from "../../Game";
import Genes from "./Genes";
import Polygon from "../Polygon";

class GeneticTank extends Tank {
    private genes: Genes;
    private targetPolygon?: Polygon;
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
        if (!this.targetPolygon || this.inFiringRange) { return [0, 0]; }
        return [this.targetPolygon.x - this.x, this.targetPolygon.y - this.y];
    }

    protected getDirection(): [number, number] {
        if (!this.targetPolygon) { return [0, 0]; }
        return [this.targetPolygon.x - this.x, this.targetPolygon.y - this.y];
    }

    protected getTriggered(): boolean {
        return this.inFiringRange;
    }

    private updatePolygonTarget(): void {
        if (this.targetPolygon && !this.targetPolygon.destoryed) { return; }

        let range = this.range * this.genes.range;
        range *= range;

        for (const entity of this.game.entities) {
            if (entity instanceof Polygon && entity.x * entity.x + entity.y * entity.y < range) {
                this.targetPolygon = entity;
                return;
            }
        }

        this.targetPolygon = undefined;
    }

    private updateInRange(): void {
        if (!this.targetPolygon) {
            this.inFiringRange = false;
            return;
        }

        const dx = this.x - this.targetPolygon.x;
        const dy = this.y - this.targetPolygon.y;
        const dist = dx * dx + dy * dy;
        let distBeforeFiring = this.genes.distanceBeforeFiring * this.genes.range * this.range;
        distBeforeFiring *= distBeforeFiring;
        this.inFiringRange = dist < distBeforeFiring;
    }
}

export default GeneticTank;