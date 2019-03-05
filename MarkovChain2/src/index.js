/** @type {HTMLTextAreaElement} */
// @ts-ignore
const $in = document.getElementById("input");
/** @type {HTMLTextAreaElement} */
// @ts-ignore
const $out = document.getElementById("output");

/** @type {HTMLInputElement} */
// @ts-ignore
const $nodeLengthI = document.getElementById("nodeLengthI");
/** @type {HTMLInputElement} */
// @ts-ignore
const $delimiterI = document.getElementById("delimiterI");
/** @type {HTMLInputElement} */
// @ts-ignore
const $delimiterFlagsI = document.getElementById("delimiterFlagsI");
/** @type {HTMLInputElement} */
// @ts-ignore
const $substituterI = document.getElementById("substituterI");

const $submit = document.getElementById("submit");

/**
 * @typedef Options
 * @property {number} nodeLength
 * @property {Function} [substituter]
 * @property {RegExp} delimiter
 */

/**
 * @type {Options}
 */
const options = {
    nodeLength: 2,
    delimiter: / /,
    substituter: null
};

fetch('romeoandjuliet.txt')
    .then(e => e.text())
    .then(e => $in.value = e)
    .then(() => updateOut());

addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
        submit();
    }
});

$submit.addEventListener("click", function() {
    submit();
});

function submit(e) {
    updateOptions();
    updateOut();
}

function updateOptions() {
    {
        const val = parseInt($nodeLengthI.value)
        if (!isNaN(val)) {
            options.nodeLength = val;
        }
    } {
        options.delimiter = new RegExp($delimiterI.value, );
    } {
        options.substituter = Function("node", $substituterI.value);
    }
}

$nodeLengthI.value = options.nodeLength.toString();
$delimiterI.value = options.delimiter.source;
$delimiterFlagsI.value = options.delimiter.flags;
$substituterI.value = "return node;";

function updateOut() {
    $out.value = generateStringMarkov(generateMarkovChain($in.value, options.nodeLength, options.delimiter, options.substituter));
}