import { isEqualEqualable } from "./equalable.js";
import findRepeating from "./findRepeating.js";
// adapted from https://github.com/eikes/suffixtree/blob/master/js/suffixtree.js
/*
 * Copyright (C) 2012 Eike Send
 *
 * http://eike.se/nd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
class STNode {
    constructor() {
        this.leaves = [];
        this.nodes = [];
    }
    checkNodes(suf) {
        var node;
        for (var i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i];
            if (isEqualEqualable(node.value, suf[0])) {
                node.addSuffix(suf.slice(1));
                return true;
            }
        }
        return false;
    }
    checkLeaves(suf) {
        var node, leaf;
        for (var i = 0; i < this.leaves.length; i++) {
            leaf = this.leaves[i];
            if (isEqualEqualable(leaf[0], suf[0])) {
                node = new STNode();
                node.value = leaf[0];
                node.addSuffix(suf.slice(1));
                node.addSuffix(leaf.slice(1));
                this.nodes.push(node);
                this.leaves.splice(i, 1);
                return;
            }
        }
        this.leaves.push(suf);
    }
    addSuffix(suf) {
        if (!suf.length)
            return;
        if (!this.checkNodes(suf)) {
            this.checkLeaves(suf);
        }
    }
    getLongestRepeating() {
        var str = [];
        var temp = [];
        for (var i = 0; i < this.nodes.length; i++) {
            temp = this.nodes[i].getLongestRepeating();
            if (temp.length > str.length) {
                str = temp;
            }
        }
        if (this.value) {
            str.unshift(this.value);
        }
        return str;
    }
}
class SuffixTree {
    constructor(str) {
        this.node = new STNode();
        for (var i = 0; i < str.length; i++) {
            this.node.addSuffix(str.slice(i));
        }
        this.inLength = str.length;
    }
    getLongestRepeating() {
        return this.node.getLongestRepeating();
    }
    getLongestNonOverlappingRepeating(minLength) {
        let longestRepeating = this.getLongestRepeating();
        return findRepeating(longestRepeating, minLength);
    }
}
export default SuffixTree;
