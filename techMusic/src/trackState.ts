import { Equalable } from "./equalable";

class TrackState implements Equalable {
    public bool?: boolean;
    public ref?: TrackState[]

    constructor(bool: boolean);
    constructor(ref: TrackState[]);
    constructor(a: boolean | TrackState[]) {
        if (Array.isArray(a)) {
            this.ref = a;
        } else {
            this.bool = a;
        }
    }

    public equals(other: TrackState): boolean {
        if (this.bool !== undefined) {
            return other.bool === this.bool;
        } else {
            return other.ref === this.ref;
        }
    }
}

export default TrackState;