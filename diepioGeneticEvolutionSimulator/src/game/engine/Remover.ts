import IRemovable from "./interfaces/IRemovable";

class Remover {
    public removeAllIfDestoryed(entities: IRemovable[]): void {
        for (let i = entities.length - 1; i >= 0; i--) {
            if (entities[i].destoryed) {
                entities.splice(i, 1);
            }
        }
    }
}

export default Remover;