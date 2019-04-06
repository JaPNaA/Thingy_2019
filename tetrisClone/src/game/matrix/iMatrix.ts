export default interface IMatrix<T> {
    matrix: T[][];
    width: number;
    height: number;
    forEach(cb: (elm: T, x: number, y: number) => void): void;
}