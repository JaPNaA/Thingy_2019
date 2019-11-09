class Test {
    /**
     * @param {string[]} words 
     */
    constructor(words) {
        this.words = [].slice.call(words);
    }

    popRandom() {
        if (this.words.length <= 0) { return; }
        const index = Math.floor(Math.random() * this.words.length);
        return this.words.splice(index, 1)[0];
    }
}

/** @type {HTMLInputElement} */
// @ts-ignore
const $input = document.getElementById("word");

const $say = document.getElementById("say");
const $results = document.getElementById("results");

/** @type {Function[]} */
const inputOnceHandlers = [];

/** @type {string} */
let currentWord;

$input.addEventListener("change", function () {
    for (const handler of inputOnceHandlers) {
        handler();
    }

    inputOnceHandlers.length = 0;
    $input.value = "";
});

$say.addEventListener("click", function () {
    sayCurrentWord();
});

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 9) { return; }

    if (e.keyCode === 82 && e.altKey) {
        sayCurrentWord();
    } else {
        $input.focus();
    }
});

/**
 * @returns {Promise<string>}
 */
function forInput() {
    return new Promise(res =>
        inputOnceHandlers.push(() => res($input.value))
    );
}

function sayCurrentWord() {
    if (!currentWord) { return; }
    const utterance = new SpeechSynthesisUtterance(currentWord);
    speechSynthesis.speak(utterance);
}

/**
 * @param {string} word 
 */
function cleanWord(word) {
    return word.trim().toLowerCase();
}

/**
 * @param {string} text 
 */
function log(text) {
    const line = document.createElement("div");
    line.innerHTML = text;

    if ($results.firstChild) {
        $results.insertBefore(line, $results.firstChild);
    } else {
        $results.appendChild(line);
    }
}

async function main() {
    const wordsStr = await fetch("./words.txt").then(e => e.text());
    if (!wordsStr) { throw new Error("No words loaded"); }
    const words = wordsStr.split("\n");

    while (true) {
        const test = new Test(words);
        let wordsCount = 0;
        let correct = 0;

        while (currentWord = test.popRandom()) {
            wordsCount++;

            sayCurrentWord();
            const inputted = await forInput();

            const expected = cleanWord(currentWord);
            const actual = cleanWord(inputted);

            if (expected === actual) {
                log("<span class=\"correct\">Correct - " + expected + "</span>");
                correct++;
            } else {
                log(
                    "<span class=\"incorrect\"> Incorrect, you wrote <code class=\"incorrect\">" + actual + "</code> <br> " +
                    "but it was actually <code class=\"correct\">" + expected + "</code> </span>"
                );
            }
        }

        log("---- You got: " + correct + " of " + wordsCount + " words ----");
    }
}

main();