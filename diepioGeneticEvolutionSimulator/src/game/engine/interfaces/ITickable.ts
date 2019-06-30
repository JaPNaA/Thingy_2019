export default interface ITickable {
    tick(deltaTime: number): void;
    fixedTick(): void;
}