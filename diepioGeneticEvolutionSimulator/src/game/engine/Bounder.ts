import Boundaries from "../entities/Boundaries";
import IEntity from "./interfaces/IEntity";

class Bounder {
    private boundaries?: Boundaries;

    public setBoundaries(boundaries: Boundaries) {
        this.boundaries = boundaries;
    }

    public boundAll(entities: IEntity[]): void {
        if (!this.boundaries) { return; }

        for (const entity of entities) {
            if (entity.x < entity.radius) {
                entity.x = entity.radius;
                entity.vx = Math.abs(entity.vx);
            } else if (entity.x > this.boundaries.width - entity.radius) {
                entity.x = this.boundaries.width - entity.radius;
                entity.vx = -Math.abs(entity.vx);
            }

            if (entity.y < entity.radius) {
                entity.y = entity.radius;
                entity.vy = Math.abs(entity.vy);
            } else if (entity.y > this.boundaries.height - entity.radius) {
                entity.y = this.boundaries.height - entity.radius;
                entity.vy = -Math.abs(entity.vy);
            }
        }
    }
}

export default Bounder;