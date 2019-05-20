import { getModelArtifactsInfoForJSON } from "@tensorflow/tfjs-core/dist/io/io";

/**
 * @typedef {import("@tensorflow/tfjs-core/dist/io/io").ModelArtifacts} ModelArtifacts
 * @typedef {import("@tensorflow/tfjs-core/dist/io/io").SaveResult} SaveResult
 */

class StringIOHandler {
    /**
     * @param {{string: string}} obj Object with string attribute to save to
     */
    constructor(obj) {
        this.obj = obj;
    }

    /**
     * @param {ModelArtifacts} artifacts
     * @returns {Promise<SaveResult>}
     */
    async save(artifacts) {
        this.obj.string = JSON.stringify(artifacts, (key, value) => {
            if (value instanceof ArrayBuffer) {
                /** @type {any[]} */
                let arr = ["jsonEncodedArrayBuffer"];
                const view = new Uint8Array(value);
                for (let i = 0; i < view.length; i++) {
                    arr.push(view[i]);
                }
                return arr;
            } else {
                return value;
            }
        });

        return {
            modelArtifactsInfo: getModelArtifactsInfoForJSON(artifacts)
        };
    }

    /**
     * @returns {Promise<ModelArtifacts>}
     */
    async load() {
        const obj = JSON.parse(this.obj.string);
        const keys = Object.keys(obj);

        for (const key of keys) {
            if (Array.isArray(obj[key]) && obj[key][0] === "jsonEncodedArrayBuffer") {
                /** @type {number[]} */
                const encoded = obj[key].slice(1);
                const ab = new ArrayBuffer(encoded.length);
                const view = new Uint8Array(ab);
                for (let i = 0; i < encoded.length; i++) {
                    view[i] = encoded[i];
                }
                obj[key] = ab;
            }
        }

        return obj;
    }
}

export default StringIOHandler;