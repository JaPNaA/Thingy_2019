class TrackState {
    constructor(a) {
        if (Array.isArray(a)) {
            this.ref = a;
        }
        else {
            this.bool = a;
        }
    }
    equals(other) {
        if (this.bool !== undefined) {
            return other.bool === this.bool;
        }
        else {
            return other.ref === this.ref;
        }
    }
}
export default TrackState;
