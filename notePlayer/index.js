const sequence = [
    new Note(400, 100, { fadeOutTime: 0.04, type: "sine" }),
    new Note(440, 100, { fadeOutTime: 0.04, type: "sine" }),
    new Note(480, 100, { fadeOutTime: 0.04, type: "sine" })
];

main();

// TODO: get midi file and convert to sequence

async function main() {
    await Note.setup();

    addEventListener("click", async function () {
        const player = new Player();

        // const keys = Object.keys(noteValues);
        // player.play(500, noteValues[keys[Math.floor(Math.random() * keys.length)]]);

        for (const note of sequence) {
            await player.playNote(note);
        }
    });
}
