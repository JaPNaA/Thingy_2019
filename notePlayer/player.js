
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

        oscillator.connect(gain);
        gain.connect(this.context.destination);

        oscillator.frequency.value = frequency;

        oscillator.start(this.context.currentTime);

        await wait(time);

        gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + (fadeOutTime / 1000));
        await wait(fadeOutTime + 10);
        oscillator.stop();
    }

    /**
     * @param {Note} note 
     */
    async playNote(note) {
        console.log(note);
        await this.play(note.time, note.frequency, note.options.type, note.options.fadeOutTime);
    }
}
