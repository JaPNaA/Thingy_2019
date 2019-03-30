
/**
 * @typedef NoteOptions
 * @property {number} fadeOutTime
 * @property {OscillatorType} type
 */

/** @type {NoteOptions} */
const defaultOptions = {
    fadeOutTime: 40,
    type: "sine"
};

class Note {
    /**
     * @param {number | string} [frequency] 
     * @param {number} [time] 
     * @param {NoteOptions} [options]
     */
    constructor(frequency, time, options) {
        this.time = time || Note.defaultTime;

        if (typeof frequency === "string") {
            this.frequency = Note.noteNames[frequency] || Note.defaultFrequency;
        } else {
            this.frequency = frequency || Note.defaultFrequency;
        }

        this.options = options ? Object.assign({}, defaultOptions, options) : defaultOptions;
    }

    static async setup() {
        this.noteNames = await fetch("notes.json").then(e => e.json());
    }
}

Note.defaultFrequency = 440;
Note.defaultTime = 0.04;