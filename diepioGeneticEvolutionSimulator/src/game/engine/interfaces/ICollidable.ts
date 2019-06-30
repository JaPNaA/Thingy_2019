export default interface IColliable {
    x: number;
    y: number;
    radius: number;

    collideWith(other: any & IColliable): void;
}