import Engine from "../engine/Engine";
import Game from "../Game";
import IEntity from "../engine/interfaces/IEntity";
import { mouse } from "../engine/ui/Mouse";
import GeneticTank from "../entities/tank/GeneticTank";
import Genes from "../entities/tank/Genes";
import TankBuild from "../entities/tank/TankBuild";
import Bullet from "../entities/Bullet";
import { keyboard } from "../engine/ui/Keyboard";
import Polygon from "../entities/Polygon";

class DataViewer {
    public attachOnClick = true;

    private game: Game;
    private engine: Engine<IEntity>;

    private fontSize = 12;
    private lineHeight = 1.15;
    private lastAttachedEntity?: IEntity;

    constructor(game: Game, engine: Engine<IEntity>) {
        this.game = game;
        this.engine = engine;

        this.setup();
    }

    public setup(): void {
        this.engine.onRender(() => this.onRender());
    }

    public onRender(): void {
        const tree = this.engine.getQuadTree();
        const entity = tree.queryOne(mouse.x, mouse.y, 1);

        if (keyboard.isDown('esc')) {
            this.engine.attachCameraTo(undefined);
        }

        if (entity) {
            this.drawDataFor(entity);

            if (this.attachOnClick && mouse.down) {
                if (entity != this.lastAttachedEntity) {
                    console.log("attach", entity);
                }
                this.lastAttachedEntity = entity;
                this.engine.attachCameraTo(entity);
            }
        }
    }

    private drawDataFor(entity: IEntity): void {
        const X = this.engine.canvas.getX();
        const texts = this.getEntityDataString(entity);
        const widths = [];

        let totalWidth = 0;
        let totalHeight = 0;
        for (const text of texts) {
            const { width, height } = this.getTextDim(X, text, this.fontSize);
            widths.push(width + 12);
            totalWidth += width + 12;
            totalHeight = Math.max(height, totalHeight);
        }

        X.font = this.fontSize + "px Ubuntu, Arial";
        X.textBaseline = "top";

        X.save();
        this.engine.camera.applyTranslateOnly(X);
        X.translate(
            entity.x * this.engine.camera.scale,
            entity.y * this.engine.camera.scale
        );

        X.beginPath();
        X.lineWidth = 2;
        X.fillStyle = "#ababab88";
        X.strokeStyle = "#333333aa";
        X.rect(0, 0, totalWidth + 8, totalHeight + 8);
        X.fill();
        X.stroke();

        X.fillStyle = "#000000";
        X.translate(4, 4);
        for (let i = 0; i < texts.length; i++) {
            this.writeText(X, texts[i], this.fontSize);
            X.translate(widths[i], 0);
        }

        X.restore();
    }

    private writeText(X: CanvasRenderingContext2D, text: string, fontSize: number): void {
        const lines = text.split("\n");
        let i = 0;

        for (; i < lines.length; i++) {
            X.fillText(lines[i], 0, i * (fontSize * this.lineHeight));
        }
    }

    private getTextDim(X: CanvasRenderingContext2D, text: string, fontSize: number): { width: number, height: number } {
        const lines = text.split("\n");
        let height = 0;
        let width = 0;

        for (const line of lines) {
            height += fontSize * this.lineHeight;
            width = Math.max(width, X.measureText(line).width);
        }

        return {
            width: width,
            height: height - (fontSize * (this.lineHeight - 1))
        };
    }

    private getEntityDataString(entity: IEntity): string[] {
        if (entity instanceof GeneticTank) {
            return [[
                "Genetic Tank",
                "TeamID: " + entity.teamID,
                "TimeToNewTeam: " + (entity.timeToNewTeamID && Math.floor(entity.timeToNewTeamID)),
                "Level: " + entity.levels.level,
                "TotalXP: " + this.round(entity.levels.totalXP, 10),
                "IsSearchingForMate: " + entity.searchingForMate.toString(),
                "",
                "--- Build ---",
                this.buildToString(entity.build)
            ].join("\n"),
            [
                "--- Genes ---",
                this.genesToString(entity.genes),
            ].join("\n"),
            [
                "Number of canons: " + entity.tankClass.canons.length
            ].join("\n")];
        } else if (entity instanceof Bullet) {
            return [[
                "Bullet",
                "TeamID: " + entity.teamID,
                "TTL: " + Math.floor(entity.ttl),
                "Health: " + this.round(entity.health, 10),
                "Damage: " + this.round(entity.damage, 10)
            ].join("\n")];
        } else if (entity instanceof Polygon) {
            return [[
                "Polygon",
                "Health: " + this.round(entity.health, 10)
            ].join("\n")];
        } else {
            return [entity.constructor.name + '\n' + "TeamID: " + entity.teamID];
        }
    }

    private genesToString(genes: Genes): string {
        const keys = Object.keys(genes).sort() as (keyof Genes)[];
        let str = [];

        for (const key of keys) {
            const val = genes[key];
            if (typeof val === 'number') {
                str.push(key + ": " + this.round(val, 100));
            } else {
                str.push(key + ": [" + val.constructor.name + "]");
            }
        }

        return str.join("\n");
    }

    private buildToString(build: TankBuild): string {
        const str = [];

        for (const key of TankBuild.keys) {
            str.push(key + ": " + build[key]);
        }

        return str.join("\n");
    }

    private round(x: number, factor: number): number {
        return Math.round(x * factor) / factor;
    }
}

export default DataViewer;