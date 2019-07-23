import IEntity from "./interfaces/IEntity";

const SLEEP_THRESHOLD = 0.0005;

class Sleeper {
    public sleepAll(entities: IEntity[]) {
        for (const entity of entities) {
            entity._sleeping = Math.abs(entity.vx) + Math.abs(entity.vy) < SLEEP_THRESHOLD;
        }
    }
}

export default Sleeper;