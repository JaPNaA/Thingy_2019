import Tank from "./Tank";
import Game from "../../Game";
import Genes from "./Genes";
import Entity from "../../Entity";
import OpenSimplexNoise from "open-simplex-noise";
import Bullet from "../Bullet";
import TankBuild from "./TankBuild";
import TankLevels from "./TankLevels";
import GeneticTankCursor from "./GeneticTankCursor";

class GeneticTank extends Tank {
    public genes: Genes;
    public timeToNewTeamID?: number;
    public searchingForMate: boolean;

    private target?: Entity;
    private mate?: GeneticTank;
    private inIdealRange: boolean;
    private tooClose: boolean;
    private noise: OpenSimplexNoise;
    private noiseProgress: number;

    private static reproductionCost = TankLevels.requiredForLevel[10];
    private static maxGeneDistCompatible = 1.6;
    private static hueVariation = 45;

    private cursor: GeneticTankCursor;

    constructor(game: Game, x: number, y: number, genes: Genes, hue?: number) {
        super(game, x, y);
        this.genes = genes;
        this.inIdealRange = false;
        this.tooClose = false;
        this.searchingForMate = false;

        if (hue) { this.hue = hue; }
        this.noiseProgress = Math.random() * 100;
        this.unstableness = 1 - this.genes.accuracy;

        this.noise = new OpenSimplexNoise(Math.random() * Number.MAX_SAFE_INTEGER);
        this.cursor = new GeneticTankCursor();
        this.tankClass = genes.class.clone();
    }

    public tick(deltaTime: number): void {
        this.updateTarget();
        this.updateRangeStates();
        super.tick(deltaTime);
        this.updateTeamIdIfShould(deltaTime);
    }

    public fixedTick(): void {
        super.fixedTick();
        this.cursor.fixedTick();
    }

    public collideWith(other: Entity): void {
        if (other === this.mate) {
            this.mateWith(this.mate);
        }

        super.collideWith(other);
    }

    protected getMovement(deltaTime: number): [number, number] {
        if (this.mate) {
            return [this.mate.x - this.x, this.mate.y - this.y];
        }
        if (!this.target) {
            return this.wander(deltaTime);
        }
        if (this.inIdealRange) {
            if (this.tooClose) {
                return [this.x - this.target.x, this.y - this.target.y];
            } else {
                return [0, 0];
            }
        } else {
            return [this.target.x - this.x, this.target.y - this.y];
        }
    }

    protected getDirection(): [number, number] {
        if (this.target) {
            this.cursor.setTarget(
                this.target.x - this.x,
                this.target.y - this.y
            );
        }

        return [this.cursor.x, this.cursor.y];
    }

    protected getTriggered(): boolean {
        return Boolean(this.target && this.target != this.mate);
    }

    protected onLevelUp(): void {
        super.onLevelUp();

        while (!TankBuild.upgrade(
            this.build,
            this.getRandomStatByGenes()
        )) { }

        this.updateStatsWithBuild();
    }

    protected setMotherTeam(motherTeamID: number, care: number): void {
        this.setTeamID(motherTeamID);
        this.timeToNewTeamID = 120_000 * care;
    }

    protected reactHit(by: Entity): void {
        super.reactHit(by);
        if (by.teamID === this.teamID) { return; }
        if (by instanceof Bullet) {
            if (by.firer && this.canBeTarget(by.firer)) {
                this.target = by.firer;
            }
        } else if (by instanceof Tank) {
            if (this.canBeTarget(by)) {
                this.target = by;
            }
        }
    }

    private updateTarget(): void {
        this.updateMate();
        if (this.target && this.canBeTarget(this.target)) {
            return;
        }

        const entities = this.game.quadTree.query(this.x, this.y, this.range * this.genes.range);
        let closest = undefined;
        let closestDistSquared = Infinity;

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.teamID === this.teamID) { continue; }

            const dx = entity.x - this.x;
            const dy = entity.y - this.y;
            const distSquared = dx * dx + dy * dy;

            if (distSquared > closestDistSquared) { continue; }

            if (entity instanceof Tank) {
                if (Math.random() < this.genes.aggression / 16) {
                    closest = entity;
                    closestDistSquared = distSquared;
                }
            } else if (entity.targetable) {
                closest = entity;
                closestDistSquared = distSquared;
            }
        }

        this.target = closest;
    }

    private canBeTarget(entity?: Entity): boolean {
        if (!entity) { return false; }

        const range = this.range * this.genes.range;
        const dx = entity.x - this.x;
        const dy = entity.y - this.y;
        const distSquared = dx * dx + dy * dy;

        return Boolean(
            !entity.destoryed &&
            entity.teamID !== this.teamID &&
            distSquared <= range * range
        );
    }

    private updateRangeStates(): void {
        if (!this.target) { return; }

        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        const dist = dx * dx + dy * dy;
        let distBeforeFiring = this.genes.idealDistance * this.genes.range * this.range;
        let comfortableDist = distBeforeFiring * this.genes.comfortableDistance;
        distBeforeFiring *= distBeforeFiring;
        this.inIdealRange = dist < distBeforeFiring;
        this.tooClose = dist < comfortableDist;
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

    private mateWith(other: GeneticTank): void {
        const babyX = (other.x + this.x) / 2;
        const babyY = (other.y + this.y) / 2;
        const thisCare = this.genes.care * 0.3 + 0.1;
        const otherCare = other.genes.care * 0.3 + 0.1;
        const totalCare = this.genes.care + other.genes.care;

        const thisNewXP = this.levels.totalXP - GeneticTank.reproductionCost;
        const otherNewXP = other.levels.totalXP - GeneticTank.reproductionCost;

        const thisPoints = thisNewXP * (1 - thisCare);
        const otherPoints = otherNewXP * (1 - otherCare);
        const givePoints = thisNewXP * thisCare + otherNewXP * otherCare;

        TankBuild.reset(this.build);
        TankBuild.reset(other.build);
        this.levels.reset();
        this.levels.addXP(thisPoints);
        other.levels.reset();
        other.levels.addXP(otherPoints);

        const baby = new GeneticTank(
            this.game, babyX, babyY,
            Genes.combineAndMutate(this.genes, other.genes),
            this.mixHue(this.hue, other.hue) + (Math.random() - 0.5) * GeneticTank.hueVariation
        );
        baby.levels.addXP(givePoints);
        baby.setMotherTeam(this.teamID, totalCare);
        other.setMotherTeam(this.teamID, totalCare);
        this.setMotherTeam(this.teamID, totalCare);

        this.game.addEntity(baby);

        this.target = undefined;
        this.mate = undefined;
        other.target = undefined;
        other.mate = undefined;

        console.log("mated", {
            baby, this: this, other
        });
    }

    private updateMate(): void {
        if (this.mate && !this.mate.destoryed && this.mate.searchingForMate) { return; }

        this.searchingForMate = this.levels.level >=
            (this.genes.levelToReproduction * 0.75 + 0.25) * TankLevels.maxLevel;

        if (!this.searchingForMate) { return; }

        this.mate = undefined;

        let closest: GeneticTank | undefined;
        let closestDist = Infinity;

        for (const entity of this.game.entities) {
            if (
                entity !== this &&
                entity instanceof GeneticTank &&
                entity.searchingForMate &&
                this.genes.compare(entity.genes) <= GeneticTank.maxGeneDistCompatible
            ) {
                const dx = entity.x - this.x;
                const dy = entity.y - this.y;
                const dist = dx * dx + dy * dy;
                if (dist < closestDist) {
                    closest = entity;
                    closestDist = dist;
                }
            }
        }

        this.mate = closest;
    }

    private updateTeamIdIfShould(deltaTime: number): void {
        if (this.timeToNewTeamID === undefined) { return; }
        this.timeToNewTeamID -= deltaTime;

        if (this.timeToNewTeamID < 0) {
            this.resetTeamId();
            this.timeToNewTeamID = undefined;
        }
    }

    private mixHue(a: number, b: number): number {
        const d = Math.abs(a - b);
        if (d <= 180) {
            return (a + b) / 2;
        } else {
            return (a + b) / 2 + 180 % 360;
        }
    }
}

export default GeneticTank;