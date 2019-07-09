export default interface IEntity {
    radius: number;
    x: number;
    y: number;
    quadTreeX: number;
    quadTreeY: number;
    vx: number;
    vy: number;
    destoryed: boolean;

    render(X: CanvasRenderingContext2D): void;
    tick(deltaTime: number): void;
    fixedTick(): void;
    collideWith(other: any): void;
}