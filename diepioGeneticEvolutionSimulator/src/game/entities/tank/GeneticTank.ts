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
    private genes: Genes;
    private target?: Entity;
    private inIdealRange: boolean;
    private tooClose: boolean;
    private noise: OpenSimplexNoise;
    private noiseProgress: number;
    private timeToNewTeamID?: number;

    private cursor: GeneticTankCursor;

    constructor(game: Game, x: number, y: number, genes: Genes) {
        super(game, x, y);
        this.genes = genes;
        this.inIdealRange = false;
        this.tooClose = false;
        this.noise = new OpenSimplexNoise(Math.random() * Number.MAX_SAFE_INTEGER);
        this.noiseProgress = Math.random() * 100;

        this.cursor = new GeneticTankCursor();

        this.unstableness = 1 - this.genes.accuracy;
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

    protected getMovement(deltaTime: number): [number, number] {
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
        return Boolean(this.target);
    }

    protected onLevelUp(): void {
        super.onLevelUp();

        while (!TankBuild.upgrade(
            this.build,
            this.getRandomStatByGenes()
        )) { }

        this.reproduceIfShould();
        this.updateStatsWithBuild();
    }

    protected setMotherTeam(motherTeamID: number, care: number): void {
        this.setTeamID(motherTeamID);
        this.timeToNewTeamID = 120_000 * care;
    }

    protected reactHit(by: Entity): void {
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
                if (Math.random() < this.genes.aggression) {
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
            distSquared <= range * range
        );
    }

    private updateRangeStates(): void {
        if (!this.target) {
            this.inIdealRange = false;
            this.tooClose = false;
            return;
        }

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

    private reproduceIfShould(): void {
        if (
            this.levels.level <
            (this.genes.levelToReproduction * 0.75 + 0.25) * TankLevels.maxLevel
        ) { return; }

        const randomAngle = Math.random() * Math.PI * 2;
        const radius2 = this.radius - 2;
        const care = this.genes.care * 0.6 + 0.2;

        const selfPoints = this.levels.totalXP * (1 - care);
        const givePoints = this.levels.totalXP * care;
        TankBuild.reset(this.build);
        this.levels.reset();
        this.levels.addXP(selfPoints);

        const baby = new GeneticTank(
            this.game,
            this.x + Math.cos(randomAngle) * radius2,
            this.y + Math.sin(randomAngle) * radius2,
            this.genes.copyAndMutate()
        );
        baby.levels.addXP(givePoints);
        baby.setMotherTeam(this.teamID, this.genes.care);

        this.game.addEntity(baby);
    }

    private updateTeamIdIfShould(deltaTime: number): void {
        if (this.timeToNewTeamID === undefined) { return; }
        this.timeToNewTeamID -= deltaTime;

        if (this.timeToNewTeamID < 0) {
            this.resetTeamId();
            this.timeToNewTeamID = undefined;
        }
    }
}

export default GeneticTank;