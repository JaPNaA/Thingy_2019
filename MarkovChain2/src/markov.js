class MarkovChainNode {
    constructor() {
        /**
         * The total number of times it's pointed to everything
         * @type {number}
         */
        this.total = 0;

        /**
         * What this node maps to [result, probability]
         * @type {[string, number][]}
         */
        this.maps = [];
    }

    /**
     * Adds or increases possibility the node maps to string
     * @param {String} str string to map to
     */
    add(str) {
        this.total++;

        for (let i = 0; i < this.maps.length; i++) {
            if (this.maps[i][0] === str) {
                this.maps[i][1]++;
                return;
            }
        }

        this.maps.push([str, 1]);
    }

    /**
     * Randomly selects one to follow
     * @returns {string}
     */
    getOne() {
        const rand = this.total * Math.random();
        /** @type {number} */
        let sum = 0;

        for (let elm of this.maps) {
            if (elm[1] + sum > rand) {
                return elm[0];
            }

            sum += elm[1];
        }

        throw new Error("Illegal state");
    }
}

class MarkovChain {
    /**
     * @param {number} nodeLength 
     * @param {string} delimiter
     * @param {number} inputLength
     */
    constructor(nodeLength, delimiter, inputLength) {
        /** @type {Map<string, MarkovChainNode>} */
        this.map = new Map();

        this.nodeLength = nodeLength;
        this.delimiter = delimiter;
        this.inputLength = inputLength;
    }

    /**
     * Adds a node to the chain
     * @param {string} nodeName name of node
     * @param {string} pointsTo value it points to
     */
    add(nodeName, pointsTo) {
        const node = this.map.get(nodeName);

        if (node) {
            node.add(pointsTo);
        } else {
            const node = new MarkovChainNode();
            this.map.set(nodeName, node);
            node.add(pointsTo);
        }
    }
}

/**
 * Generates a markov chain
 * @param {string} input Text to generate Markov Chain from
 * @param {number} nodeLength the length of each markov chain node
 * @param {string | RegExp} delimiter 
 * @param {Function} [substituter] function that replaces nodes
 * @returns {MarkovChain} markov chain generated from text
 */
function generateMarkovChain(input, nodeLength, delimiter, substituter) {
    let arr = input.split(delimiter);

    if (substituter) {
        arr = arr.map((node) => substituter(node));
    }

    /** @type {String[]} */
    const last = [];

    /** @type {String} */
    let delimiterStr;
    if (typeof delimiter == "string") {
        delimiterStr = delimiter;
    } else {
        delimiterStr = delimiter.source;
    }

    /** @type {MarkovChain} */
    const chain = new MarkovChain(nodeLength, delimiterStr, arr.length);
    let i = 0;

    for (; i < arr.length; i++) {
        chain.add(last.slice(i - nodeLength, i).join(delimiterStr), arr[i]);
        last.push(arr[i]);
    }

    chain.add(last.slice(i - nodeLength, i).join(delimiterStr), undefined);

    return chain;
}

/**
 * Generates a string using Markov Chains
 * @param {MarkovChain} chain text to generate from
 * @returns {string} output
 */
function generateStringMarkov(chain) {
    let str = [];

    let i = 0;
    while (i < chain.inputLength * 2) {
        const subarr = str.slice(i - chain.nodeLength, i);
        const node = chain.map.get(subarr.join(chain.delimiter));

        if (node) {
            str.push(node.getOne());
        } else {
            break;
        }
        i++;
    }

    return str.join(chain.delimiter);
}