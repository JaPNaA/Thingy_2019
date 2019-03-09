const channels = {
    r: 0,
    g: 1,
    b: 2,
    a: 3
};

const SimplexNoise = SimplexNoiseModule();

class Segment {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this._buildElm();
        /** Name of segment */
        this.name = name;
    }

    setup() {
        const h2 = document.createElement("h2");
        h2.innerText = this.name;
        this.elm.insertBefore(h2, this.elm.firstChild);

        this._setImageData();
        this.generateNoise();
        this._putImageData();
    }

    /**
     * appends this to elm
     * @param {HTMLElement} elm 
     * @returns {Segment}
     */
    appendTo(elm) {
        elm.appendChild(this.elm);
        return this;
    }

    /** Generates noise for segment */
    generateNoise() {
        throw new Error("Not implemented");
    }

    _buildElm() {
        this.elm = document.createElement("div");

        this.canvas = document.createElement("canvas");
        this.X = this.canvas.getContext("2d");
        this.elm.appendChild(this.canvas);
    }

    _setImageData() {
        this.imageData = this.X.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    _putImageData() {
        this.X.putImageData(this.imageData, 0, 0);
    }
}

class NormalNoiseSegment extends Segment {
    constructor() {
        super("Value noise");
    }

    generateNoise() {
        const length = this.imageData.width * this.imageData.height;
        for (let i = 0; i < length; i++) {
            const v = Math.random() * 256;
            const index = i * 4;

            this.imageData.data[index + channels.r] = v;
            this.imageData.data[index + channels.g] = v;
            this.imageData.data[index + channels.b] = v;
            this.imageData.data[index + channels.a] = 255;
        }
    }
}

class ValueNoiseSegment extends Segment {
    constructor() {
        super("Octave Value Noise");
    }

    generateNoise() {
        const octaves = 10;
        const width = this.imageData.width;
        const height = this.imageData.height;

        for (let i = 0; i < octaves; i++) {
            const scale = 1 << i;
            const scaled256 = 256 / octaves;
            const imageData = this.X.createImageData(width, height);
            // const length = imageData.width * imageData.height;

            for (let y = 0; y < height; y += scale) {
                const yindex = y * width;

                for (let x = 0; x < width; x += scale) {
                    const index = (x + yindex) * 4;
                    const random = Math.random() * scaled256;

                    imageData.data[index + channels.r] = random;
                    imageData.data[index + channels.g] = random;
                    imageData.data[index + channels.b] = random;
                    imageData.data[index + channels.a] = 255;
                }
            }

            const height1 = height - 1;
            const width1 = width - 1;

            for (let y = 0; y < height1; y += scale) {
                const yindex = y * width;
                const nextyindex = (y + scale) * width;

                for (let x = 0; x < width1; x += scale) {
                    const index = (x + yindex) * 4;
                    const nextx = (x + scale + yindex) * 4;
                    const nexty = (x + nextyindex) * 4;
                    const nextxy = (x + scale + nextyindex) * 4;

                    const random00 = imageData.data[index];
                    const random10 = imageData.data[nextx];
                    const random01 = imageData.data[nexty];
                    const random11 = imageData.data[nextxy];

                    for (let y1 = 0; y1 < scale; y1++) {
                        const y1index = y1 * width;
                        const yweight = y1 / scale;
                        const iyweight = 1 - yweight;

                        for (let x1 = 0; x1 < scale; x1++) {
                            const index1 = index + (x1 + y1index) * 4;
                            const xweight = x1 / scale;
                            const ixweight = 1 - xweight;

                            const valx0 = random10 * xweight + random00 * ixweight;
                            const valx1 = random11 * xweight + random01 * ixweight;
                            const tval = valx0 * iyweight + valx1 * yweight;

                            imageData.data[index1 + channels.r] = tval;
                            imageData.data[index1 + channels.g] = tval;
                            imageData.data[index1 + channels.b] = tval;
                            imageData.data[index1 + channels.a] = 255;
                        }
                    }
                }
            }

            this._mergeImageData(imageData);
        }
    }

    /**
     * @param {ImageData} imageData 
     */
    _mergeImageData(imageData) {
        const length = imageData.width * imageData.height * 4;
        for (let i = 0; i < length; i++) {
            this.imageData.data[i] += imageData.data[i];
        }
    }
}

class PerlinNoiseSegment extends Segment {
    constructor() {
        super("Perlin noise");
        this.initalizeGradientGrid();
    }

    /**
     * Linear interpolate
     * @param {number} a0 
     * @param {number} a1 
     * @param {number} w 
     * @returns {number}
     */
    lerp(a0, a1, w) {
        return a0 + w * (a1 - a0);
    }

    /**
     * Computes the dot product of the distance and gradient vectors
     * @param {number} ix 
     * @param {number} iy 
     * @param {number} x 
     * @param {number} y 
     * @returns {number}
     */
    dotGridGradient(ix, iy, x, y) {
        const dx = x - ix;
        const dy = y - iy;
        return (dx * this.gradient[iy][ix][0] + dy * this.gradient[iy][ix][1]);
    }

    /**
     * Computer perlin noise at coordinates x, y
     * @param {number} x
     * @param {number} y 
     */
    perlin(x, y) {
        // Determine grid cell coordinates
        const x0 = Math.trunc(x);
        const x1 = x0 + 1;
        const y0 = Math.trunc(y);
        const y1 = y0 + 1;

        // Determine interpolation weights
        // Could also use higher order polynomial/s-curve here
        const sx = x - x0;
        const sy = y - y0;

        let n0, n1, ix0, ix1;
        n0 = this.dotGridGradient(x0, y0, x, y);
        n1 = this.dotGridGradient(x1, y0, x, y);
        ix0 = this.lerp(n0, n1, sx);
        n0 = this.dotGridGradient(x0, y1, x, y);
        n1 = this.dotGridGradient(x1, y1, x, y);
        ix1 = this.lerp(n0, n1, sx);

        return this.lerp(ix0, ix1, sy);
    }

    initalizeGradientGrid() {
        /** @type {[number, number][][]} */
        this.gradient = [];

        for (let i = 0; i < 100; i++) {
            this.gradient[i] = [];

            for (let j = 0; j < 100; j++) {
                this.gradient[i][j] = [0, 0];

                this.gradient[i][j][0] = Math.random();
                this.gradient[i][j][1] = Math.random();
                const normalize = this.norm(this.gradient[i][j][0], this.gradient[i][j][1]);
                this.gradient[i][j][0] /= normalize;
                this.gradient[i][j][1] /= normalize;
            }
        }
    }

    /**
     * @param {number} a 
     * @param {number} b 
     */
    norm(a, b) {
        if (a !== 0 && b !== 0) {
            return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
        } else {
            return 1;
        }
    }

    generateNoise() {
        const width = this.imageData.width;
        const height = this.imageData.height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const val = ((this.perlin(x / width * 20, y / width * 20) + 0.3) / 0.6) * 256;

                this.imageData.data[index + channels.r] = val;
                this.imageData.data[index + channels.g] = val;
                this.imageData.data[index + channels.b] = val;
                this.imageData.data[index + channels.a] = 255;
            }
        }
    }
}

class SimplexNoiseSegment extends Segment {
    constructor() {
        super("Simplex Noise (from a 3rd party library)");
        this.noise = new SimplexNoise();
        console.log(this.noise);
    }

    generateNoise() {
        const width = this.imageData.width;
        const height = this.imageData.height;

        for (let y = 0; y < height; y++) {
            const yindex = y * width;

            for (let x = 0; x < width; x++) {
                const index = (x + yindex) * 4;
                const val = ((this.noise.noise2D(x / 25, y / 25) + 1) / 2) * 256;

                this.imageData.data[index + channels.r] = val;
                this.imageData.data[index + channels.g] = val;
                this.imageData.data[index + channels.b] = val;
                this.imageData.data[index + channels.a] = 255;
            }
        }
    }
}

new NormalNoiseSegment().appendTo(document.body).setup();
new ValueNoiseSegment().appendTo(document.body).setup();
new PerlinNoiseSegment().appendTo(document.body).setup();
new SimplexNoiseSegment().appendTo(document.body).setup();