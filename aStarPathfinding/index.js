/**
 * This is a long file, and should be broken up,
 * but like, that requires configuration settings and tsc --init
 * and like, a little bit of work!
 * And I don't want to do a little bit of work to make other work
 * much easier!
 *
 * I only do the simpliest thing the most complicated way
 * or the most complicated thing the simpliest way
 *
 * @author JaPNaA
 */
const SPACING = 16;
const canvas = document.getElementById("c");
const X = canvas.getContext("2d");
function main() {
    const grid = new Grid(Math.floor(innerWidth / SPACING), Math.floor(innerHeight / SPACING));
    const renderer = new Renderer(grid, X);
    const aStarAlg = new AStarAlgorithm(grid);
    const userHandler = new UserHandler(grid, renderer, aStarAlg);
    userHandler.update();
    console.log(userHandler);
}
class Cell {
    constructor(index) {
        this.index = index;
        this.isBlock = false;
    }
}
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        const size = width * height;
        for (let i = 0; i < size; i++) {
            this.cells[i] = new Cell(i);
        }
        this.plotFunc = this.setBlock;
        this.size = size;
    }
    isInBounds(x, y) {
        /** I do wish I could specify to make JavaScript/Typescript inline some code */
        return !(x < 0 || y < 0 || y >= this.height || x >= this.width);
    }
    get(x, y) {
        return this.cells[x + y * this.width];
    }
    get_index(i) {
        return this.cells[i];
    }
    // note: lower performace
    setBlock(x, y) {
        if (this.isInBounds(x, y)) {
            this.get(x, y).isBlock = true;
        }
    }
    // note: lower performace
    unsetBlock(x, y) {
        if (this.isInBounds(x, y)) {
            this.get(x, y).isBlock = false;
        }
    }
    setLine(x0, y0, x1, y1) {
        this.plotFunc = this.setBlock;
        this.plotLine(x0, y0, x1, y1);
    }
    unsetLine(x0, y0, x1, y1) {
        this.plotFunc = this.unsetBlock;
        this.plotLine(x0, y0, x1, y1);
    }
    plotLine(x0, y0, x1, y1) {
        if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
            if (x0 > x1) {
                this.plotLineLow(x1, y1, x0, y0);
            }
            else {
                this.plotLineLow(x0, y0, x1, y1);
            }
        }
        else {
            if (y0 > y1) {
                this.plotLineHigh(x1, y1, x0, y0);
            }
            else {
                this.plotLineHigh(x0, y0, x1, y1);
            }
        }
    }
    plotLineLow(x0, y0, x1, y1) {
        const dx = x1 - x0;
        let dy = y1 - y0;
        let yi = 1;
        if (dy < 0) {
            yi = -1;
            dy = -dy;
        }
        let D = 2 * dy - dx;
        let y = y0;
        for (let x = x0; x <= x1; x++) {
            this.plotFunc(x, y);
            if (D > 0) {
                y = y + yi;
                D = D - 2 * dx;
            }
            D = D + 2 * dy;
        }
    }
    plotLineHigh(x0, y0, x1, y1) {
        let dx = x1 - x0;
        const dy = y1 - y0;
        let xi = 1;
        if (dx < 0) {
            xi = -1;
            dx = -dx;
        }
        let D = 2 * dx - dy;
        let x = x0;
        for (let y = y0; y < y1; y++) {
            this.plotFunc(x, y);
            if (D > 0) {
                x = x + xi;
                D = D - 2 * dy;
            }
            D = D + 2 * dx;
        }
    }
    indexToXY(i) {
        return [i % this.width, Math.trunc(i / this.width)];
    }
    getNeighbors(i) {
        const cells = [];
        const [x, y] = this.indexToXY(i);
        for (const neighborOffset of Grid.neighborOffsets) {
            const nx = x + neighborOffset[0];
            const ny = y + neighborOffset[1];
            if (this.isInBounds(nx, ny)) {
                cells.push(this.get(nx, ny));
            }
        }
        return cells;
    }
    // not combined: performance
    getNonBlockNeighbors(i) {
        const cells = [];
        const [x, y] = this.indexToXY(i);
        for (const neighborOffset of Grid.neighborOffsets) {
            const nx = x + neighborOffset[0];
            const ny = y + neighborOffset[1];
            const cell = this.get(nx, ny);
            if (this.isInBounds(nx, ny) && !cell.isBlock) {
                cells.push(cell);
            }
        }
        return cells;
    }
}
// private static neighborOffsets: [number, number][] = [
//     [-1, -1], [0, -1], [1, -1],
//     [-1, 0], [1, 0],
//     [-1, 1], [0, 1], [1, 1]
// ];
Grid.neighborOffsets = [
    [0, -1],
    [-1, 0], [1, 0],
    [0, 1]
];
class CanvasResizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.loopTTL = 5000;
        this.loopStartedTime = 0;
        this.loopRunning = false;
        this.lastWidth = -1;
        this.lastHeight = -1;
    }
    update() {
        if (this.hasChanged()) {
            this.updateDims();
        }
    }
    updateByListener() {
        if (this.hasChanged()) {
            this.updateDims();
        }
        else {
            this.startResizeLoop();
        }
    }
    hasChanged() {
        return this.lastWidth !== innerWidth || this.lastHeight !== innerHeight;
    }
    updateDims() {
        this.canvas.width = this.lastWidth = innerWidth;
        this.canvas.height = this.lastHeight = innerHeight;
        if (this.loopRunning) {
            cancelAnimationFrame(this.reqanfHandle);
        }
    }
    startResizeLoop() {
        this.loopStartedTime = performance.now();
        this.resizeCheckLoop(this.loopStartedTime);
    }
    // support for iDontFollowResizeStandardsPhone
    resizeCheckLoop(now) {
        if (this.hasChanged() || now > this.loopStartedTime + this.loopTTL) {
            this.update();
            this.loopRunning = false;
            return;
        }
        else {
            this.loopRunning = true;
        }
        this.reqanfHandle = requestAnimationFrame(this.resizeCheckLoop.bind(this));
    }
}
class Renderer {
    constructor(grid, X) {
        this.grid = grid;
        this.X = X;
        this.spacing = 16;
    }
    render() {
        this.X.clearRect(0, 0, this.X.canvas.width, this.X.canvas.height);
        this.drawBlocks();
        this.drawGrid();
    }
    drawGrid() {
        this.X.strokeStyle = "#aaaaaa";
        this.X.lineWidth = 1;
        this.X.beginPath();
        const maxWidth = this.grid.width * this.spacing;
        const maxHeight = this.grid.height * this.spacing;
        for (let x = 0; x <= this.grid.width; x++) {
            this.X.moveTo(x * this.spacing, 0);
            this.X.lineTo(x * this.spacing, maxHeight);
        }
        for (let y = 0; y <= this.grid.height; y++) {
            this.X.moveTo(0, y * this.spacing);
            this.X.lineTo(maxWidth, y * this.spacing);
        }
        X.stroke();
    }
    drawBlocks() {
        this.X.fillStyle = "#000000";
        for (let y = 0; y < this.grid.height; y++) {
            const ywidth = y * this.grid.width;
            for (let x = 0; x < this.grid.width; x++) {
                if (this.grid.get_index(ywidth + x).isBlock) {
                    this.X.fillRect(x * this.spacing, y * this.spacing, this.spacing, this.spacing);
                }
            }
        }
    }
    highlightCells(cells) {
        if (!cells) {
            return;
        }
        for (let cell of cells) {
            const [x, y] = this.grid.indexToXY(cell.index);
            this.X.fillStyle = "#ff0000";
            this.X.fillRect(x * this.spacing, y * this.spacing, this.spacing, this.spacing);
        }
    }
}
class MapWithDefaultInfinity extends Map {
    constructor() { super(); }
    get(key) {
        const val = super.get(key);
        return val === undefined ? Infinity : val;
    }
}
class AStarAlgorithm {
    constructor(grid) {
        this.grid = grid;
    }
    aStar(start, goal) {
        // The set of nodes already evaluated
        const closedSet = new Set();
        // The set of currently discovered nodes that are not evaluated yet.
        // Initially, only the start node is known.
        const openSet = new Set([start]);
        // For each node, which node it can most efficiently be reached from.
        // If a node can be reached from many nodes, cameFrom will eventually contain the
        // most efficient previous step.
        const cameFrom = new Map();
        // For each node, the cost of getting from the start node to that node.
        const gScore = new MapWithDefaultInfinity();
        // The cost of going from start to start is zero.
        gScore.set(start, 0);
        // For each node, the total cost of getting from the start node to the goal
        // by passing by that node. That value is partly known, partly heuristic.
        const fScore = new MapWithDefaultInfinity();
        // For the first node, that value is completely heuristic.
        fScore.set(start, this.heuristicCostEstimate(start, goal));
        while (openSet.size != 0) {
            const current = this.getLowestFScoreValue(fScore, openSet); // the node in openSet having the lowest fScore[] value;
            if (current === goal) {
                return this.reconstructPath(cameFrom, current);
            }
            openSet.delete(current);
            closedSet.add(current);
            for (const neighbor of this.grid.getNonBlockNeighbors(current.index)) {
                if (closedSet.has(neighbor)) {
                    continue; // Ignore the neighbor which is already evaluated.
                }
                // The distance from start to a neighbor
                const tentativeGScore = gScore.get(current) + this.distBetween(current, neighbor);
                if (!openSet.has(neighbor)) { // Discover a new node
                    openSet.add(neighbor);
                }
                else if (tentativeGScore >= gScore.get(neighbor)) {
                    continue;
                }
                // This path is the best until now. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + this.heuristicCostEstimate(neighbor, goal));
            }
        }
    }
    reconstructPath(cameFrom, current) {
        const total_path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            total_path.push(current);
        }
        return total_path;
    }
    distBetween(a, b) {
        const [ax, ay] = this.grid.indexToXY(a.index);
        const [bx, by] = this.grid.indexToXY(b.index);
        const dx = ax - bx;
        const dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }
    getLowestFScoreValue(fScores, cellSet) {
        let lowest = Infinity;
        let lowestCell;
        for (const cell of cellSet) {
            const cellFScore = fScores.get(cell);
            if (cellFScore < lowest) {
                lowest = cellFScore;
                lowestCell = cell;
            }
        }
        return lowestCell;
    }
    heuristicCostEstimate(start, goal) {
        return this.distBetween(start, goal);
    }
}
class UserHandler {
    constructor(grid, renderer, aStarAlg) {
        this.grid = grid;
        this.renderer = renderer;
        this.aStarAlg = aStarAlg;
        this.pathfinderResults = [];
        this.addMouseListeners();
        this.initResizeHandler();
    }
    update() {
        this.updatePathfinding();
        this.render();
    }
    render() {
        this.renderer.render();
        this.renderer.highlightCells(this.pathfinderResults);
    }
    updatePathfinding() {
        this.pathfinderResults = this.aStarAlg.aStar(this.grid.get(0, 0), this.grid.get(20, 10));
    }
    addMouseListeners() {
        addEventListener("mousedown", this.onMouseDown.bind(this));
        addEventListener("mouseup", this.onMouseUp.bind(this));
        addEventListener("mousemove", this.onMouseMove.bind(this));
        addEventListener("contextmenu", e => e.preventDefault());
    }
    initResizeHandler() {
        addEventListener("resize", this.onResize.bind(this));
        this.canvasResizer = new CanvasResizer(canvas);
        this.canvasResizer.update();
    }
    onMouseDown(event) {
        this.isMouseDown = true;
        this.buttonDown = event.button;
        this.setLastCursorPos(event.clientX, event.clientY);
        this.interact(event.clientX, event.clientY);
    }
    onMouseUp(event) {
        this.isMouseDown = false;
        this.buttonDown = event.button;
    }
    onMouseMove(event) {
        this.interact(event.clientX, event.clientY);
        this.setLastCursorPos(event.clientX, event.clientY);
    }
    onResize() {
        this.canvasResizer.updateByListener();
        this.render();
    }
    setLastCursorPos(x, y) {
        this.lastCursorX = x;
        this.lastCursorY = y;
    }
    interact(x, y) {
        if (!this.isMouseDown)
            return;
        switch (this.buttonDown) {
            case 0:
                this.setBlockAtCursorAndUpdate(x, y);
                break;
            case 2:
                this.unsetBlockAtCursorAndUpdate(x, y);
                break;
        }
    }
    setBlockAtCursorAndUpdate(cursorX, cursorY) {
        const [x, y] = this.cursorToXY(cursorX, cursorY);
        const [lastX, lastY] = this.cursorToXY(this.lastCursorX, this.lastCursorY);
        this.grid.setLine(lastX, lastY, x, y);
        this.grid.setBlock(x, y);
        this.update();
    }
    unsetBlockAtCursorAndUpdate(cursorX, cursorY) {
        const [x, y] = this.cursorToXY(cursorX, cursorY);
        const [lastX, lastY] = this.cursorToXY(this.lastCursorX, this.lastCursorY);
        this.grid.unsetLine(lastX, lastY, x, y);
        this.grid.unsetBlock(x, y);
        this.update();
    }
    cursorToXY(cursorX, cursorY) {
        return [Math.trunc(cursorX / this.renderer.spacing), Math.trunc(cursorY / this.renderer.spacing)];
    }
}
main();
