// ==UserScript==
// @name         Better image viewer
// @version      0.1
// @description  A better image viewer
// @author       someRandomGuy
// @include      *://*/*
// @grant        none
// @namespace    https://greasyfork.org/users/117222
// ==/UserScript==

(function () {
    "use strict";

    if (document.body.childNodes.length === 1 && document.body.children[0].tagName === "IMG") {
        initSinglePageImageViewer();
    } else {
        initOverlayImageViewer();
    }

    /**
     * Class name prefix,
     * don't want any style query collisions
     * @type {string}
     */
    const clsP = "better-image-viewer-userscript-";

    class ImageViewer {
        /**
         * ImageViewer constructor
         * @param {HTMLImageElement} img
         */
        constructor(img) {
            /**
             * The element that contains it all
             * @type {HTMLDivElement}
             */
            this.elm = document.createElement("div");
            this.elm.classList.add(clsP + "elm");

            /**
             * The background
             * @type {HTMLDivElement}
             */
            this.background = document.createElement("div");
            this.background.classList.add(clsP + "background");
            this.elm.appendChild(this.background);

            /**
             * The image
             * @type {HTMLImageElement}
             */
            this.img = img;
            this.img.classList.add(clsP + "img");
            this.elm.appendChild(this.img);


            /**
             * The width of the image
             * @type {number}
             */
            this.width = this.img.naturalWidth;

            /**
             * The height of the image
             * @type {number}
             */
            this.height = this.img.naturalHeight;

            /**
             * The boundary width
             * @type {number}
             */
            this.boundWidth = innerWidth;

            /**
             * The boundary height
             * @type {number}
             */
            this.boundHeight = innerHeight;

            /**
             * The boundary padding
             * @type {number}
             */
            this.padding = Math.min(this.boundWidth + this.boundHeight) * 0.1;

            /**
             * Is the user dragging the image?
             * @type {boolean}
             */
            this.isDragging = false;

            /**
             * Translate X, first applied
             * @type {number}
             */
            this.x = 0;

            /**
             * Translate Y, first applied
             * @type {number}
             */
            this.y = 0;

            /**
             * Translate X target
             * @type {number}
             */
            this.tx = 0;

            /**
             * Translate Y target
             * @type {number}
             */
            this.ty = 0;

            /**
             * Velocity X
             * @type {number}
             */
            this.vx = 0;

            /**
             * Velocity Y
             * @type {number}
             */
            this.vy = 0;

            /**
             * Cursor X
             * @type {number}
             */
            this.cursorX = 0;

            /**
             * Cursor Y
             * @type {number}
             */
            this.cursorY = 0;

            /**
             * Last cursor X
             * @type {number}
             */
            this.lastCursorX = 0;

            /**
             * Last cursor Y
             * @type {number}
             */
            this.lastCursorY = 0;

            /**
             * Scale, second applied
             * @type {number}
             */
            this.scale = 1;

            /**
             * Target scale
             * @type {number}
             */
            this.tScale = this.scale;

            /**
             * Rotation, third applied, radians
             * @type {number}
             */
            this.rotation = 0;


            this._setup();
        }

        /**
         * Append to parent
         * @param {HTMLElement} parent
         */
        appendTo(parent) {
            if (!ImageViewer.hasInjectedCSS) {
                document.head.appendChild(createCSS());
                ImageViewer.hasInjectedCSS = true;
            }
            parent.appendChild(this.elm);
        }

        /**
         * Destorys and removes imageView
         */
        destory() {
            this.elm.parentElement.removeChild(this.elm);
            this._removeEventListeners();
        }

        /**
         * Sets up ImageViewer
         */
        _setup() {
            this._addEventListeners();
            this._reqanfLoop = this._reqanfLoop.bind(this);
            this._resetImageTransform();
            this._stopAnimations();
            this._reqanfLoop();
        }

        /**
         * Adds event listeners
         */
        _addEventListeners() {
            this.background.addEventListener("click", this._onBackgroundClick.bind(this));
            this.img.addEventListener("mousedown", this._onMouseDown.bind(this));
            this.img.addEventListener("dblclick", this._onDoubleClick.bind(this));
            this.elm.addEventListener("wheel", this._onWheel.bind(this));

            this._onMouseMove = this._onMouseMove.bind(this);
            addEventListener("mousemove", this._onMouseMove.bind(this));

            this._onMouseUp = this._onMouseUp.bind(this);
            addEventListener("mouseup", this._onMouseUp);
        }

        /**
         * Removes event listeners not bound to imageview elements
         */
        _removeEventListeners() {
            removeEventListener("mouseup", this._onMouseUp);
            removeEventListener("mousemove", this._onMouseMove);
        }

        /**
         * RequestAnimationFrame loop
         */
        _reqanfLoop() {
            this._tick();
            this._updateInlineStyles();
            requestAnimationFrame(this._reqanfLoop);
        }

        /**
         * Tick physics
         */
        _tick() {
            this.lastCursorX = this.cursorX;
            this.lastCursorY = this.cursorY;

            if (!this.isDragging) {
                this.x += this.vx;
                this.y += this.vy;
                this.tx += this.vx;
                this.ty += this.vy;
                this.vx *= 0.95;
                this.vy *= 0.95;
            }

            this.x += (this.tx - this.x) / 5;
            this.y += (this.ty - this.y) / 5;

            this.scale += (this.tScale - this.scale) / 5;

            if (this.scale > 6) {
                this.img.style.setProperty("image-rendering", "pixelated");
            } else {
                this.img.style.setProperty("image-rendering", "unset");
            }

            this._restrainToBoundaries();
        }

        /**
         * Restrain the image to boundaries
         */
        _restrainToBoundaries() {
            const twidth = this.tScale * this.width;
            const theight = this.tScale * this.height;

            if (this.ty > this.boundHeight - this.padding) {
                this.ty = this.boundHeight - this.padding;
            } else if (this.ty < this.padding - theight) {
                this.ty = this.padding + -theight;
            }

            if (this.tx > this.boundWidth - this.padding) {
                this.tx = this.boundWidth - this.padding;
            } else if (this.tx < this.padding + -twidth) {
                this.tx = this.padding + -twidth;
            }

        }

        /**
         * Update inline styles of image
         */
        _updateInlineStyles() {
            this.img.style.width = this.width * this.scale + "px";
            this.img.style.height = this.height * this.scale + "px";
            this.img.style.transform = "translate(" + this.x + "px," + this.y + "px) rotate(" + this.rotation + "rad)";
        }


        // --- Event Handlers ---
        /**
         * Handles a click on the background
         */
        _onBackgroundClick() {
            this.destory();
        }

        /**
         * Handles mouse down events
         * @param {MouseEvent} e event
         */
        _onMouseDown(e) {
            e.preventDefault();
            this.isDragging = true;
        }

        /**
         * Handles mouse up events
         * @param {MouseEvent} e event
         */
        _onMouseUp(e) {
            e.preventDefault();
            this.isDragging = false;

            this.vx = this.cursorX - this.lastCursorX;
            this.vy = this.cursorY - this.lastCursorY;
        }

        /**
         * Handles mouse move events
         * @param {MouseEvent} e event
         */
        _onMouseMove(e) {
            e.preventDefault();
            if (this.isDragging) {
                this._translate(e.movementX, e.movementY);
            }

            this.cursorX = e.layerX;
            this.cursorY = e.layerY;
        }

        /**
         * Handles wheel events
         * @param {WheelEvent} e event
         */
        _onWheel(e) {
            let scale;
            if (e.deltaY < 0) {
                scale = ImageViewer.scaleFactor;
            } else {
                scale = 1 / ImageViewer.scaleFactor;
            }

            this._zoomInto(scale, e.layerX, e.layerY);
        }

        /**
         * Handles double click events
         */
        _onDoubleClick() {
            throw new Error("double click not implemented");
        }

        // --- Transformations ---

        /**
         * Translates the image
         * @param {number} x x translation
         * @param {number} y y translation
         */
        _translate(x, y) {
            this.tx += x;
            this.x += x;
            this.ty += y;
            this.y += y;
        }

        /**
         * Zooms into a point
         * @param {number} factor factor to zoom in by
         * @param {number} x point to zoom into
         * @param {number} y point to zoom into
         */
        _zoomInto(factor, x, y) {
            this.tScale *= factor;
            this.tx -= (x - this.tx) * (factor - 1);
            this.ty -= (y - this.ty) * (factor - 1);
        }

        /**
         * Resets the image's transform
         */
        _resetImageTransform() {
            if (this.width <= this.boundWidth && this.height <= this.boundHeight) {
                this.tScale = 1;
            } else {
                this.tScale = Math.min(
                    this.boundWidth / this.width,
                    this.boundHeight / this.height
                );
            }

            this.tx = (this.boundWidth - this.width * this.tScale) / 2;
            this.ty = (this.boundHeight - this.height * this.tScale) / 2;
            this.vx = 0;
            this.vy = 0;
        }

        // --- Animation Control ---
        _stopAnimations() {
            this.x = this.tx;
            this.y = this.ty;
            this.scale = this.tScale;
            this.vx = 0;
            this.vy = 0;
        }

    }

    /**
     * Has injected CSS into current document?
     * @type {boolean}
     */
    ImageViewer.hasInjectedCSS = false;

    /**
     * The speed of zooming
     * @type {number}
     */
    ImageViewer.scaleFactor = 1.2;


    function initSinglePageImageViewer() {
        // @ts-ignore
        const src = document.body.children[0].src;
        createImageViewer(src).then(imageView => {
            while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
            imageView.appendTo(document.body);
        });
    }

    function initOverlayImageViewer() {
        document.body.addEventListener("click", function (e) {
            if (!(e.target instanceof HTMLAnchorElement)) { return; }
            const link = e.target.href;
            if (!link) { return; }

            if (link && /\.(png|jpg|gif)$/i.test(link)) {
                e.preventDefault();
                createImageViewer(link).then(viewer => {
                    viewer.appendTo(document.body);
                    viewer.elm.classList.add("overlay");
                });
            }
        });
    }

    /**
     * Creates the injected CSS
     * @returns {HTMLStyleElement}
     */
    function createCSS() {
        const style = document.createElement("style");
        style.innerHTML = `
            .${clsP}elm {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2147483647; /* Always. on. top. */
            }

            .${clsP}img {
                position: absolute;
                top: 0;
                left: 0;
                width: auto;
                height: auto;
                will-change: transform, width, height, top, left;
                z-index: 2;
            }

            .${clsP}background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }

            .${clsP}elm .${clsP}background {
                background-color: rgba(0, 0, 0, 0.6);
            }

            .${clsP}elm .${clsP}img {
                box-shadow: 1px 2px 8px #00000069, 0 0 4px #0000007a;
            }
        `;
        return style;
    }

    /**
     * Creates an image viewer
     * @param {string} src image source path
     * @returns {Promise<ImageViewer>}
     */
    async function createImageViewer(src) {
        const img = document.createElement("img");
        img.src = src;

        if (!img.complete) {
            await new Promise((res, rej) => {
                img.addEventListener("load", () => res());
                img.addEventListener("error", () => rej("Error loading image"));
            });
        }

        return new ImageViewer(img);
    }
})();
