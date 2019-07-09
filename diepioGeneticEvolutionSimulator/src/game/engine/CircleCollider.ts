import CircleQuadTree from "./CircleQuadTree";
import Boundaries from "../entities/Boundaries";
import IEntity from "./interfaces/IEntity";
import Square from "../entities/polygons/Square";
import Game from "../Game";

class CircleCollider {
    quadTree!: CircleQuadTree<IEntity>;
    treeIsEmpty: boolean = true;

    public collideAll(entities: IEntity[]): void {
        if (this.treeIsEmpty) {
            this.quadTree.addAll(entities);
            this.treeIsEmpty = false;
        }

        for (const entity of entities) {
            this.quadTree.updateSingle(entity);
        }

        for (let i = 0; i < entities.length; i++) {
            const collidable = entities[i];
            const other = this.quadTree.queryOne(collidable.x, collidable.y, collidable.radius, collidable);
            if (other) {
                collidable.collideWith(other);
            }
        }
    }

    public setBoundaries(boundaries: Boundaries): void {
        this.quadTree = new CircleQuadTree(Math.max(boundaries.width, boundaries.height));
        this.treeIsEmpty = true;
    }

    public newEntity(collidable: IEntity): void {
        this.quadTree.add(collidable);
    }

    public removeEntity(entity: IEntity): void {
        this.quadTree.remove(entity);
    }
}


// tests ---
(function () {

    const tree = new CircleQuadTree(100);
    tree.add(new Square(null as any as Game, 0, 0));
    tree.add(new Square(null as any as Game, 0, 0));

}());
// ---------

export default CircleCollider;