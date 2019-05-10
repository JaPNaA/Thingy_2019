function isEqualable(a) {
    return a && typeof a.equals === 'function';
}
function isEqualEqualable(a, b) {
    if (isEqualable(a)) {
        return a.equals(b);
    }
    else {
        return a === b;
    }
}
function arrayIsEqualEqualable(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!isEqualEqualable(a[i], b[i])) {
            return false;
        }
    }
    return true;
}
export { isEqualEqualable, arrayIsEqualEqualable, isEqualable };
