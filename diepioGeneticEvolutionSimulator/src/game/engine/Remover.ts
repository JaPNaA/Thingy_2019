import CircleCollider from "./CircleCollider";
import IEntity from "./interfaces/IEntity";

class Remover {
    constructor(private collider: CircleCollider) { }

    public removeAllIfDestoryed(entities: IEntity[]): void {
        for (let i = entities.length - 1; i >= 0; i--) {
            if (entities[i].destoryed) {
                this.collider.removeEntity(entities[i] as any);
                entities.splice(i, 1);
            }
        }
    }
}

export default Remover;