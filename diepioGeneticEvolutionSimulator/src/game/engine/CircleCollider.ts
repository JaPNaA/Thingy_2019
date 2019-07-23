import CircleQuadTree from "./CircleQuadTree";
import Boundaries from "../entities/Boundaries";
import IEntity from "./interfaces/IEntity";

class CircleCollider<T extends IEntity> {
    public quadTree!: CircleQuadTree<T>;

    public collideAll(entities: T[]): void {
        for (const entity of entities) {
            entity._collisionObj = undefined;
            if (entity._sleeping) { continue; }
            this.quadTree.updateSingle(entity);
        }

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity._sleeping) { continue; }
            const other = this.quadTree.queryOne(entity.x, entity.y, entity.radius, entity);
            if (other) {
                if (other._collisionObj !== entity) {
                    entity.collideWith(other);
                    entity._collisionObj = other;
                }
            }
        }
    }

    public setBoundaries(boundaries: Boundaries): void {
        this.quadTree = new CircleQuadTree(Math.max(boundaries.width, boundaries.height));
    }

    public getQuadTree(): CircleQuadTree<T> {
        return this.quadTree;
    }

    public newEntity(collidable: T): void {
        this.quadTree.add(collidable);
    }

    public removeEntity(entity: T): void {
        this.quadTree.remove(entity);
    }
}

export default CircleCollider;