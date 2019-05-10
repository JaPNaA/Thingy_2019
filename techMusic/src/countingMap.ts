export default class CountingMap extends Map<string, number> {
    public increment(key: string) {
        const currVal = this.get(key) || 0;
        this.set(key, currVal + 1);
    }
}