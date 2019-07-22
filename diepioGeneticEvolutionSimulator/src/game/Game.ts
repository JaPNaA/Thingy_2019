import Entity from "./Entity";
import Engine from "./engine/Engine";
import Square from "./entities/polygons/Square";
import Triangle from "./entities/polygons/Triangle";
import Pentagon from "./entities/polygons/Pentagon";
import Boundaries from "./entities/Boundaries";
import GeneticTank from "./entities/tank/GeneticTank";
import Genes from "./entities/tank/Genes";
import Polygon from "./entities/Polygon";
import CircleQuadTree from "./engine/CircleQuadTree";
import DataViewer from "./dataViewer/DataViewer";
import Tank from "./entities/tank/Tank";
import Config from "../config/Config";
import Player from "./entities/tank/Player";
import TankLevels from "./entities/tank/TankLevels";
import TankBuild from "./entities/tank/TankBuild";

type PolygonClass = new (game: Game, x: number, y: number) => Polygon;

class Game {
    public entities: Entity[];
    public quadTree: CircleQuadTree<Entity>;
    private config: Config;

    private static titleDelay: number = 2000;

    private startTime: number = performance.now();

    private initalTanks: number;
    private maintainTanks: number;
    private targetEntities: number;
    private size: number;

    private spawnrates: [PolygonClass, number][];

    private engine: Engine<Entity>;
    private boundaries: Boundaries;
    private dataViewer: DataViewer;

    constructor(config: Config) {
        this.entities = [];
        this.config = config;

        this.initalTanks = config.initalTanks;
        this.maintainTanks = config.maintainTanks;
        this.targetEntities = config.targetEntities;
        this.size = config.size;
        this.spawnrates = this.createSpawnrates(config);

        this.engine = new Engine(this.entities);
        this.boundaries = new Boundaries(this.size, this.size);
        this.engine.setBoundaries(this.boundaries);
        this.quadTree = this.engine.getQuadTree();
        this.dataViewer = new DataViewer(this, this.engine);

        if (config.player.beInTheGame) {
            this.createPlayer();
        }

        this.engine.debugDrawHitCircles = config.debug.drawHitCircles;
        this.engine.debugRenderQuadTree = config.debug.drawQuadTree;

        this.setup();
        this.transitionIn();
    }

    public setup(): void {
        this.populateInital();
        this.reqanf();
    }

    public appendTo(parent: Element) {
        this.engine.appendTo(parent);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.engine.newEntity(entity);
    }

    /**
     * Gets rid of half of the entities randomly
     */
    public thanosSnap(): void {
        for (const entity of this.entities) {
            if (Math.random() < 0.5) {
                entity.destory();
            }
        }
    }

    private transitionIn(): void {
        this.engine.camera.gotoNoTransition(this.size / 2, this.size / 2, Math.max(innerWidth, innerHeight) * 2);
        setTimeout(() =>
            this.engine.camera.goto(this.size / 2, this.size / 2, 1),
            Game.titleDelay
        );
    }

    private reqanf() {
        const now = performance.now() - this.startTime;
        this.engine.render();
        this.createShapesToTarget();
        this.maintainTankNumbers();

        if (now < Game.titleDelay) {
            this.drawName(now);
        }

        requestAnimationFrame(this.reqanf.bind(this));
    }

    private createSpawnrates(config: Config): [PolygonClass, number][] {
        let total =
            config.spawnRates.square +
            config.spawnRates.triangle +
            config.spawnRates.pentagon;

        return [
            [Square, config.spawnRates.square / total],
            [Triangle, config.spawnRates.triangle / total],
            [Pentagon, config.spawnRates.pentagon / total]
        ];
    }

    private drawName(now: number) {
        const X = this.engine.canvas.getX();
        const x = this.engine.canvas.width / 2;
        const y = this.engine.canvas.height / 2;
        X.save();
        X.globalAlpha = Math.min((1 - now / Game.titleDelay) * 2, 1);
        X.textBaseline = "middle";
        X.textAlign = "center";
        X.font = Math.min(innerWidth * 0.06, 64) + "px Ubuntu, Arial";
        X.fillStyle = "#000000";
        X.fillText("diep.io Genetic Evolution Simulator", x, y);
        X.restore();
    }

    private createShapesToTarget(): void {
        let amount = this.entities.length;
        for (; amount < this.targetEntities; amount++) {
            this.spawnShape();
        }
    }

    private maintainTankNumbers(): void {
        let amount = 0;
        for (const entity of this.entities) {
            if (entity instanceof Tank) {
                amount++;
                if (amount >= this.maintainTanks) { return; }
            }
        }

        for (; amount < this.maintainTanks; amount++) {
            this.addEntity(new GeneticTank(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height,
                new Genes()
            ));
        }
    }

    private spawnShape(): void {
        const rand = Math.random();
        let total = 0;

        for (const [entityType, rate] of this.spawnrates) {
            total += rate;
            if (rand < total) {
                this.addEntity(new entityType(
                    this,
                    Math.random() * this.boundaries.width,
                    Math.random() * this.boundaries.height
                ));
                break;
            }
        }
    }

    private populateInital(): void {
        for (let i = 0; i < this.initalTanks; i++) {
            this.addEntity(new GeneticTank(
                this,
                Math.random() * this.boundaries.width,
                Math.random() * this.boundaries.height,
                new Genes()
            ));
        }
    }

    private createPlayer(): void {
        const player = new Player(this, this.boundaries.width / 2, this.boundaries.height / 2);

        for (const key of TankBuild.keys) {
            player.build[key] = this.config.player.build[key];
        }

        player.levels.addXP(TankLevels.requiredForLevel[this.config.player.level] || 0);
        player.updateStatsWithBuild();

        this.dataViewer.attachOnClick = false;
        this.engine.attachCameraTo(player);
        this.addEntity(player);
    }
}

export default Game;