import NeuralNetwork from "./neuralNetwork";
import * as tf from "@tensorflow/tfjs";

class BirdBrain extends NeuralNetwork {
    constructor() {
        super(5, 8, 2);
    }

    /**
     * Should jump?
     * @param {number} y
     * @param {number} vy
     * @param {number} nextWallOpeningTop
     * @param {number} nextWallOpeningBottom
     * @param {number} distToNextWall
     */
    shouldFlap(y, vy, nextWallOpeningTop, nextWallOpeningBottom, distToNextWall) {
        const result = this.predict([y, vy, nextWallOpeningTop, nextWallOpeningBottom, distToNextWall]);
        return result[0] > result[1];
    }

    /**
     * @private
     * @returns {BirdBrain}
     */
    clone() {
        const brain = new BirdBrain();
        const weights = this.getWeights();
        const newWeights = [];

        tf.tidy(() => {
            for (let i = 0; i < weights.length; i++) {
                newWeights[i] = weights[i].clone();
            }
        });

        brain.setWeights(newWeights);
        return brain;
    }

    /**
     * Mutates the brain
     */
    mutate() { tf.tidy(() => this._mutate()); }
    _mutate() {
        const weights = this.getWeights();
        const newWeights = [];

        for (let i = 0; i < weights.length; i++) {
            const weight = weights[i];
            const shape = weight.shape;
            const values = weight.dataSync().slice();

            for (let j = 0; j < values.length; j++) {
                if (Math.random() < BirdBrain.mutationRate) {
                    values[j] += (Math.random() - 0.5) ** 2;
                }
            }

            const newWeight = tf.tensor(values, shape);
            newWeights[i] = newWeight;
        }

        this.model.setWeights(newWeights);
    }
}

BirdBrain.mutationRate = 0.1;

export default BirdBrain;