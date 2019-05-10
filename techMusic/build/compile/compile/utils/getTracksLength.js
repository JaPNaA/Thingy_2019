export default function getTracksLength(tracks) {
    let max = 0;
    for (const track of tracks) {
        const length = track.getLength();
        if (length > max) {
            max = length;
        }
    }
    return max;
}
