// ==UserScript==
// @name         Better image viewer
// @version      0.2
// @description  A better image viewer
// @author       someRandomGuy
// @include      *://*/*
// @grant        none
// @namespace    https://greasyfork.org/users/117222
// @compatible   chrome
// @compatible   firefox
// ==/UserScript==

(function () {
    "use strict";

    /**
     * Is the page just an image?
     * @type {boolean}
     */
    const isJustImage = document.body.childNodes.length === 1 && document.body.children[0] && document.body.children[0].tagName === "IMG";

    /**
     * Class name prefix,
     * don't want any style query collisions
     * @type {string}
     */
    const clsP = "better-image-viewer-userscript-";

    class ImageViewer {
        /**
         * ImageViewer constructor
         * @param {HTMLImageElement} img the image to view, should be already loaded
         * @param {boolean} canClose can the image viewer be closed?
         */
        constructor(img, canClose) {
            /**
             * The element that contains it all
             * @type {HTMLDivElement}
             */
            this.elm = document.createElement("div");
            this.elm.classList.add(clsP + "elm");
            if (canClose) {
                this.elm.classList.add(clsP + "canClose");
                this.elm.classList.add(clsP + "beforeTransitionIn");
                requestAnimationFrame(() =>
                    requestAnimationFrame(() =>
                        this.elm.classList.remove(clsP + "beforeTransitionIn")
                    )
                );
            }

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

            this.canClose = canClose;

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
             * Translate X, second applied
             * @type {number}
             */
            this.x = 0;

            /**
             * Translate Y, second applied
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
             * Scale, first applied
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
            // this mitigates effect of weird bug
            for (let i = 0; i < 100; i++) {
                try {
                    requestAnimationFrame(this._reqanfLoop);
                    break;
                } catch (err) { }
            }
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
            if (this.scale > 6) {
                this.img.style.setProperty("image-rendering", "crisp-edges");
            } else {
                this.img.style.setProperty("image-rendering", "unset");
            }

            this.img.style.width = this.width * this.scale + "px";
            this.img.style.height = this.height * this.scale + "px";
            this.img.style.transform = "translate(" + this.x + "px," + this.y + "px) rotate(" + this.rotation + "rad)";
        }


        // --- Event Handlers ---
        /**
         * Handles a click on the background
         */
        _onBackgroundClick() {
            if (this.canClose) {
                this.destory();
            }
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

            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        }

        /**
         * Handles wheel events
         * @param {WheelEvent} e event
         */
        _onWheel(e) {
            e.preventDefault();
            let scale;
            if (e.deltaY < 0) {
                scale = ImageViewer.scaleFactor;
            } else {
                scale = 1 / ImageViewer.scaleFactor;
            }

            this._zoomInto(scale, e.clientX, e.clientY);
        }

        /**
         * Handles double click events
         * @param {MouseEvent} e event
         */
        _onDoubleClick(e) {
            if (this.tScale >= 1) {
                this._resetImageTransform();
            } else {
                this._zoomInto(1 / this.tScale, e.clientX, e.clientY);
            }
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



    if (isJustImage) {
        initSinglePageImageViewer();
    } else {
        initOverlayImageViewer();
    }



    function initSinglePageImageViewer() {
        // @ts-ignore
        const src = document.body.children[0].src;
        createImageViewer(src).then(imageView => {
            while (document.body.firstChild) { document.body.removeChild(document.body.firstChild); }
            imageView.appendTo(document.body);
        });
    }

    function initOverlayImageViewer() {
        addEventListener("click", function (e) {
            // @ts-ignore
            const link = getLinkAncestor(e.target);
            if (!link) { return; }
            /*/          /* Reddit */                /* Everything else */
            const href = link.dataset.hrefUrl || link.href;
            if (!href) { return; }

            if (href && /\.(png|jpg|gif)$/i.test(href)) {
                e.preventDefault();
                createImageViewer(href).then(viewer => {
                    viewer.appendTo(document.body);
                });
            }
        });
    }

    /**
     * Gets a parent link, if any exists
     * @param {Element} elm element
     * @returns {null | HTMLAnchorElement}
     */
    function getLinkAncestor(elm) {
        let curr = elm;
        while ((!(curr instanceof HTMLAnchorElement) || !curr.href) && curr) {
            curr = curr.parentElement;
        }
        // @ts-ignore
        return curr;
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
                margin: 0;
                transition: 0.15s opacity;
            }

            .${clsP}elm.${clsP}beforeTransitionIn .${clsP}img {
                opacity: 0;
            }

            .${clsP}background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                transition: 0.15s opacity;
            }

            .${clsP}elm.${clsP}beforeTransitionIn .${clsP}img {
                opacity: 0;
            }

            .${clsP}elm.${clsP}canClose .${clsP}background {
                background-color: rgba(0, 0, 0, 0.6);
            }

            .${clsP}elm.${clsP}canClose .${clsP}img {
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

        return new ImageViewer(img, !isJustImage);
    }
})();
