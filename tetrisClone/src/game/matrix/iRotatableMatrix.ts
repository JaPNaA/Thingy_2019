import IMatrix from "./iMatrix";

export default interface IRotatableMatrix<T> extends IMatrix<T> {
    rotate(): void;
};