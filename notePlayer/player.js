
class Player {
    constructor() {
        this.context = new AudioContext();
    }

    /**
     * @param {number} time 
     * @param {number} frequency
     * @param {OscillatorType} type
     * @param {number} fadeOutTime
     */
    async play(time, frequency, type, fadeOutTime) {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.connect(gain);
        gain.connect(this.context.destination);
        oscillator.start(this.context.currentTime);

        await wait(time);

        gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + (fadeOutTime / 1000));
        await wait(fadeOutTime);

        setTimeout(() => oscillator.stop(), 100);
    }

    /**
     * @param {Note} note 
     */
    async playNote(note) {
        await this.play(note.time, note.frequency, note.options.type, note.options.fadeOutTime);
    }
}
