import CircleCollider from "./CircleCollider";
import IEntity from "./interfaces/IEntity";

class Remover<T extends IEntity> {
    constructor(private collider: CircleCollider<T>) { }

    public removeAllIfDestoryed(entities: T[]): void {
        for (let i = entities.length - 1; i >= 0; i--) {
            if (entities[i].destoryed) {
                this.collider.removeEntity(entities[i]);
                entities.splice(i, 1);
            }
        }
    }
}

export default Remover;