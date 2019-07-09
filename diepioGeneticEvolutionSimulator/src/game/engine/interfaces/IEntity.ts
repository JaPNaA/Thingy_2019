export default interface IEntity {
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    destoryed: boolean;

    _quadTreeX: number;
    _quadTreeY: number;
    _collisionObj?: IEntity;

    render(X: CanvasRenderingContext2D): void;
    tick(deltaTime: number): void;
    fixedTick(): void;
    collideWith(other: any): void;
}