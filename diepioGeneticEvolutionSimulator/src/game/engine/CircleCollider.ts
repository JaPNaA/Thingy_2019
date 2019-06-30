import IColliable from "./interfaces/ICollidable";

class CircleCollider {
    public collideAll(collidables: IColliable[]): void {
        for (let i = 0; i < collidables.length; i++) {
            for (let j = i + 1; j < collidables.length; j++) {
                const dx = collidables[i].x - collidables[j].x;
                const dy = collidables[i].y - collidables[j].y;
                const dist = collidables[i].radius + collidables[j].radius;

                if (dx * dx + dy * dy < dist * dist) {
                    collidables[i].collideWith(collidables[j]);
                }
            }
        }
    }
}

export default CircleCollider;