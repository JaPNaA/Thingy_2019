import * as tf from "@tensorflow/tfjs";
import StringIOHandler from "./stringIoHandler";

class NeuralNetwork {
    /**
     * @param {number} inputNodes number of input nodes
     * @param {number} hiddenNodes number of hidden nodes
     * @param {number} outputNodes number of output nodes
     */
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.destoryed = false;

        this.model = this._createModel();
    }

    /**
     * @param {number[]} inputs 
     */
    predict(inputs) { return tf.tidy(() => this._predict(inputs)); }
    /**
     * @param {number[]} inputs
     * @private
     */
    _predict(inputs) {
        const inputTensor = tf.tensor2d([inputs]);
        const outputTensor = this.model.predict(inputTensor);
        if (Array.isArray(outputTensor)) {
            return outputTensor[0].dataSync();
        } else {
            return outputTensor.dataSync();
        }
    }

    /**
     * Sets the weights of another neural network
     * @param {tf.Tensor<tf.Rank>[]} weights
     */
    setWeights(weights) {
        this.model.setWeights(weights);
    }

    getWeights() {
        return this.model.getWeights();
    }

    _createModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: this.hiddenNodes,
            inputShape: [this.inputNodes],
            activation: "sigmoid"
        }));
        model.add(tf.layers.dense({
            units: this.outputNodes,
            activation: "softmax"
        }));
        return model;
    }

    /**
     * Converts the neural network into a string
     */
    async serialize() {
        const obj = { string: null };
        await this.model.save(new StringIOHandler(obj));
        return obj.string;
    }

    /**
     * Imports serialized string
     * @param {string} str
     */
    importString(str) { tf.tidy(() => this._importString(str)); }
    /**
     * @private
     * @param {string} str
     */
    _importString(str) {
        tf.loadLayersModel(new StringIOHandler({ string: str }))
            .then(model => {
                this.setWeights(model.getWeights());
                try { model.dispose(); } catch (err) { console.warn(err); }
            });
    }

    destory() {
        if (this.destoryed) { return; }
        this.model.dispose();
        this.destoryed = true;
    }
}

export default NeuralNetwork;