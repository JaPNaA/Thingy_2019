/** @type {HTMLButtonElement} */
const button = document.getElementById("button");
/** @type {HTMLTextAreaElement} */
const textarea = document.getElementById("textarea");

main();

// TODO: get midi file and convert to sequence

async function main() {
    await Note.setup();

    const whiteSpaceRegex = /\s+/;
    const firstNumberRegex = /^\d+/;

    button.addEventListener("click", async function () {
        const player = new Player();
        const notesStr = textarea.value.split(whiteSpaceRegex);
        const sequence = [];

        for (const noteStr of notesStr) {
            const firstNumberMatch = noteStr.match(firstNumberRegex);
            if (firstNumberMatch) {
                const num = parseInt(firstNumberMatch[0]);
                const noteName = noteStr.slice(firstNumberMatch.length);
                sequence.push(new Note(noteName, 400 * num));
            } else {
                sequence.push(new Note(noteStr, 400));
            }
        }


        for (const note of sequence) {
            await player.playNote(note);
        }
    });
}
