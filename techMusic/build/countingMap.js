export default class CountingMap extends Map {
    increment(key) {
        const currVal = this.get(key) || 0;
        this.set(key, currVal + 1);
    }
}
