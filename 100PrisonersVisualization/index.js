const canvas = document.createElement("canvas");
const X = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class App {
	/**
	 * @param {number} amount
	 */
	constructor(amount) {
		this.amount = amount;
		this.then = performance.now();

		this.translateX = 0;
		this.translateY = 0;

		this.boxSize = 48;
		this.margin = 8;

		/** @type {Box[]} */
		this.boxes = [];
		/** @type {Box[][]} */
		this.boxChains = [];

		this.isOrganized = false;
		this.dragging = false;

		this.statusBar = new StatusBar(this);
		this.organizeButton = new OrganizeButton(this);

		this.numbersLeft = [];
		this.highlightBoxIndex = null;

		for (let i = 1; i <= this.amount; i++) {
			this.numbersLeft.push(i);
		}

		for (let i = 1; i <= this.amount; i++) {
			this.boxes.push(new Box(this, i, this.numbersLeft));
		}

		this.drawLoop();
		this.addEventListeners();
	}

	drawLoop() {
		this.draw();
		requestAnimationFrame(() => this.drawLoop());
	}

	draw() {
		if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
			canvas.width = innerWidth;
			canvas.height = innerHeight;
		}

		X.clearRect(0, 0, canvas.width, canvas.height);
		this.tickBoxes();
		this.drawBoxes();
		this.drawStatusBar();
		this.drawOrganizeButton();
	}

	tickBoxes() {
		const now = performance.now();
		const dt = now - this.then;
		this.then = now;

		for (const box of this.boxes) {
			box.tick(dt);
		}
	}

	drawBoxes() {
		if (this.organized) {
			X.translate(this.translateX, this.translateY);
			this.drawBoxesOrganized();
		} else {
			this.drawBoxesUnorganized();
		}

		X.resetTransform();
	}

	drawBoxesUnorganized() {
		let x = this.margin;
		let y = this.margin + this.statusBar.height;

		for (const box of this.boxes) {
			this.drawBox(box, x, y);

			x += this.boxSize + this.margin;

			if (x >= canvas.width - this.margin - this.boxSize) {
				x = this.margin;
				y += this.boxSize + this.margin;
			}
		}
	}

	drawBoxesOrganized() {
		let xOffset = this.margin + this.boxSize;
		let yOffset = this.margin + this.boxSize;
		let maxHeight = 0;

		for (const chain of this.boxChains) {
			const chainRadius = chain.length * (this.boxSize + this.margin) / Math.PI / 2 + this.boxSize;
			const factor = 1 / chain.length * Math.PI * 2;

			if (chainRadius > maxHeight) { maxHeight = chainRadius; }

			for (let i = 0; i < chain.length; i++) {
				const x = Math.cos(i * factor) * chainRadius + chainRadius + yOffset;
				const y = Math.sin(i * factor) * chainRadius + chainRadius + xOffset;

				const box = chain[i];

				this.drawBox(box, x, y);
			}

			xOffset += chainRadius * 2 + this.margin * 4 + this.boxSize * 4;

			if (xOffset >= canvas.width + this.margin) {
				yOffset += maxHeight * 2 + this.margin * 4 + this.boxSize * 4;
				xOffset = 0;
				maxHeight = 0;
			}
		}
	}

	drawBox(box, x, y) {
		box.x = x;
		box.y = y;
		box.width = this.boxSize;
		box.height = this.boxSize;

		box.highlight = this.highlightBoxIndex === box.index;

		box.draw(this.boxSize, this.boxSize);
	}

	drawStatusBar() {
		this.statusBar.width = canvas.width;
		this.statusBar.draw();
	}

	drawOrganizeButton() {
		this.organizeButton.x = canvas.width - this.organizeButton.width;
		this.organizeButton.draw();
	}

	addEventListeners() {
		this.mousemove = this.mousemove.bind(this);
		addEventListener("mousemove", this.mousemove);

		this.mousedown = this.mousedown.bind(this);
		addEventListener("mousedown", this.mousedown);

		this.mouseup = this.mouseup.bind(this);
		addEventListener("mouseup", this.mouseup);
	}

	removeEventListeners() {
		removeEventListener("mousemove", this.mousemove);
		removeEventListener("mousedown", this.mousedown);
		removeEventListener("mouseup", this.mouseup);
	}

	mousemove(e) {
		for (const box of this.boxes) {
			box.mousemove(e.layerX - this.translateX, e.layerY - this.translateY);
		}

		if (this.dragging) {
			this.translateX += e.movementX;
			this.translateY += e.movementY;
		}
	}

	mousedown(e) {
		if (this.organizeButton.click(e.layerX, e.layerY)) { return; }

		for (const box of this.boxes) {
			if (box.click()) {
				return;
			}
		}

		this.dragging = true;
	}

	mouseup() {
		this.dragging = false;
	}

	organize() {
		const boxesLeft = this.boxes.slice();
		this.boxChains.length = 0;
		this.translateX = 0;
		this.translateY = 0;

		while (boxesLeft.length > 0) {
			const boxChain = [];
			let box = boxesLeft.pop();

			let start = box.index;
			let curr = box.number;
			boxChain.push(box);

			while (curr !== start) {
				const index = boxesLeft.findIndex(e => e.index === curr);
				const box = boxesLeft.splice(index, 1)[0];

				if (!box) { break; }

				curr = box.number;
				boxChain.push(box);
			}

			this.boxChains.push(boxChain);
		}

		this.organized = true;
	}
}

class StatusBar {
	constructor(app) {
		this.app = app;

		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 32;
	}

	draw() {
		const { uncovered } = this._getData();

		X.fillStyle = "#000000";
		X.fillRect(this.x, this.y, this.width, this.height);

		X.fillStyle = "#ffffff";
		X.textBaseline = "middle";
		X.textAlign = "left";
		X.font = this.height / 2 + "px Arial";
		X.fillText(uncovered + " uncovered", this.x + 8, this.y + this.height / 2);
	}

	_getData() {
		let uncovered = 0;
		for (const box of this.app.boxes) {
			if (box.showing) { uncovered++ }
		}

		return { uncovered };
	}
}

class OrganizeButton {
	constructor(app) {
		this.app = app;

		this.x = 0;
		this.y = 0;
		this.width = 158;
		this.height = 32;
	}

	draw() {
		X.fillStyle = "#aaaaaa";
		X.fillRect(this.x, this.y, this.width, this.height);

		X.fillStyle = "#ffffff";
		X.font = this.height / 2 + "px Arial";
		X.textBaseline = "middle";
		X.textAlign = "center";
		X.fillText("Toggle organized", this.x + this.width / 2, this.y + this.height / 2);
	}

	click(x, y) {
		if (isPointInside(x, y, this.x, this.y, this.width, this.height)) {
			if (this.app.organized) {
				this.app.organized = false;
				this.app.translateX = 0;
				this.app.translateY = 0;
			} else {
				this.app.organize();
			}

			return true;
		}

		return false;
	}
}

class Box {
	constructor(app, index, numbersLeft) {
		this.app = app;
		this.index = index;
		this.number = this._spliceRandomNumberFrom(numbersLeft);

		this.opacity = 1;

		this.width = 0;
		this.height = 0;
		this.actualX = null;
		this.actualY = null;
		this.x = 0;
		this.y = 0;

		this.hovering = false;
		this.showing = false;
	}

	_spliceRandomNumberFrom(numbersLeft) {
		return numbersLeft.splice(Math.floor(Math.random() * numbersLeft.length), 1)[0];
	}

	draw() {
		if (this.actualX === null) {
			this.actualX = this.x;
			this.actualY = this.y;
		}

		X.save();
		X.translate(this.actualX, this.actualY);

		X.beginPath();
		X.strokeStyle = "#000000";
		X.fillStyle = "#ffffff";

		if (this.highlight) {
			X.shadowBlur = 8;
			X.shadowColor = "#ffff00";
			X.shadowOffsetX = 0;
			X.shadowOffsetY = 0;
		}

		X.rect(0, 0, this.width, this.height);

		X.stroke();
		X.fill();

		X.shadowBlur = 0;

		X.fillStyle = "#000000";
		X.textAlign = "center";
		X.textBaseline = "middle";
		X.font = (this.height / 2) + "px Arial";
		X.fillText(this.number.toString(), this.width / 2, this.height / 2);

		X.globalAlpha = this.opacity;
		X.fill();
		X.fillStyle = "#ffffff";
		X.fillText(this.index.toString(), this.width / 2, this.height / 2);

		X.restore();
	}

	tick(dt) {
		if (this.showing) {
			this.opacity -= this.opacity / 2;
		} else {
			this.opacity += (1 - this.opacity) / 10;
		}

		if (this.actualX !== null) {
			this.actualX += (this.x - this.actualX) / 10;
			this.actualY += (this.y - this.actualY) / 10;
		}
	}

	mousemove(x, y) {
		this.hovering = isPointInside(x, y, this.x, this.y, this.width, this.height);
	}

	click() {
		if (this.hovering) {
			this.showing = !this.showing;

			if (this.showing) {
				this.app.highlightBoxIndex = this.number;
			}

			return true;
		}

		return false;
	}
}

function isPointInside(pointX, pointY, rectX, rectY, rectWidth, rectHeight) {
	return (
		pointX >= rectX &&
		pointY >= rectY &&
		pointX <= rectX + rectWidth &&
		pointY <= rectY + rectHeight
	);
}

document.body.appendChild(canvas);

const app = new App(100);
