interface Equalable {
    equals(other: any): boolean;
}

function isEqualable(a: any): a is Equalable {
    return a && typeof a.equals === 'function';
}

function isEqualEqualable(a: any, b: any): boolean {
    if (isEqualable(a)) {
        return a.equals(b);
    } else {
        return a === b;
    }
}

function arrayIsEqualEqualable(a: any[], b: any[]): boolean {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
        if (!isEqualEqualable(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

export { Equalable, isEqualEqualable, arrayIsEqualEqualable, isEqualable };