class Sync {
    constructor(elm) {
        /** @type {HTMLDivElement} */
        this.elm = elm;
        this.changed = 0;
    }
}

const syncs = [new Sync(document.getElementById("left")), new Sync(document.getElementById("right"))];

function reqanf() {
    const lastChanged = syncs.reduce(
        (a, b) => a.changed > b.changed ? a : b
    );

    for (const sync of syncs) {
        if (lastChanged === sync) { continue; }
        sync.elm.scrollTop = lastChanged.elm.scrollTop;
    }

    requestAnimationFrame(reqanf);
}

requestAnimationFrame(reqanf);

let ix = 0;
/**
 * @this Sync
 */
function scrollHandler() {
    this.changed = ix++;
}

for (let sync of syncs) {
    sync.elm.addEventListener("scroll", scrollHandler.bind(sync));
}