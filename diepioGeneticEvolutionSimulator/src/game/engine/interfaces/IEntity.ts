export default interface IEntity {
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    destoryed: boolean;
    teamID: number;

    _quadTreeX: number;
    _quadTreeY: number;
    _collisionObj?: IEntity;
    _canSleep: boolean;
    _sleeping: boolean;

    render(X: CanvasRenderingContext2D, now: number): void;
    tick(deltaTime: number): void;
    fixedTick(): void;
    collideWith(other: any): void;
    __debugRenderHitCircle(X: CanvasRenderingContext2D): void;
}