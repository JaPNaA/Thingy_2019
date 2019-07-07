export interface IXPGivable {
    giveXP(xp: number): void;
}

export function isXPGivable(x: any): x is IXPGivable {
    return x && typeof x.giveXP === 'function';
}