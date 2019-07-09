import IEntity from "./interfaces/IEntity";

/**
 * The root of a quad tree implementation that checks for
 * collisions with circles
 */
class CircleQuadTree<T extends IEntity> implements QuadTreeChild<T> {
    private static leafMax = 4;
    private static maxDepth = 8;

    public elements: T[];

    /** Quadrants [I (++), II (-+), III (--), IV(+-)] */
    public children: QuadTreeChild<T>[] | null;

    private halfSize: number;

    constructor(size: number) {
        this.elements = [];
        this.children = null;

        this.halfSize = size / 2;
    }

    public addAll(objs: T[]): void {
        for (const obj of objs) {
            this.add(obj);
        }
    }

    public add(obj: T): void {
        const x = obj.x;
        const y = obj.y;
        const radius = obj.radius;

        obj.quadTreeX = x;
        obj.quadTreeY = y;

        let that: QuadTreeChild<T> = this;
        let cx: number = this.halfSize;
        let cy: number = this.halfSize;
        let qSize: number = this.halfSize / 2;
        let eSize!: number;
        // let depth: number = 0;

        while (true) {
            eSize = qSize / 2;
            // depth++;

            if (that.children === null) {
                // add to leaf
                that.elements.push(obj);
                if (that.elements.length > CircleQuadTree.leafMax) {
                    this.growLeaf(that, cx, cy);
                }
                break;
            } else {
                if (y > cy) {
                    if (x > cx) {
                        if (x - radius >= cx && y - radius >= cy) {
                            that = that.children[0];
                            cx += qSize;
                            cy += qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj); // put on branch if can't fully fit in leaf
                            break;
                        }
                    } else {
                        if (x + radius <= cx && y - radius >= cy) {
                            that = that.children[1];
                            cx -= qSize;
                            cy += qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    }
                } else {
                    if (x > cx) {
                        if (x - radius >= cx && y + radius <= cy) {
                            that = that.children[3];
                            cx += qSize;
                            cy -= qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    } else {
                        if (x + radius <= cx && y + radius <= cy) {
                            that = that.children[2];
                            cx -= qSize;
                            cy -= qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Update single element in tree
     */
    public updateSingle(obj: T): void {
        const qtX = obj.quadTreeX;
        const qtY = obj.quadTreeY;
        const newX = obj.x;
        const newY = obj.y;
        const radius = obj.radius;

        obj.quadTreeX = newX;
        obj.quadTreeY = newY;

        // keep track of "stack"
        /** [child, cx, cy, halfSize of child] */
        const treeStack: [QuadTreeChild<T>, number, number, number][] = [];

        let found = false;
        let that: QuadTreeChild<T> = this;
        let cx: number = this.halfSize;
        let cy: number = this.halfSize;
        let qSize: number = this.halfSize / 2;
        let eSize!: number;

        // search for object
        outer: while (true) {
            eSize = qSize / 2;

            for (let i = that.elements.length - 1; i >= 0; i--) {
                if (that.elements[i] === obj) {
                    that.elements.splice(i, 1);
                    found = true;
                    break outer;
                }
            }

            treeStack.push([that, cx, cy, qSize]);

            // if wasn't found in elements, go one level deeper
            if (that.children === null) {
                break; // end of tree
            } else {
                if (qtY > cy) {
                    if (qtX > cx) {
                        that = that.children[0];
                        cx += qSize;
                        cy += qSize;
                        qSize = eSize;
                    } else {
                        that = that.children[1];
                        cx -= qSize;
                        cy += qSize;
                        qSize = eSize;
                    }
                } else {
                    if (qtX > cx) {
                        that = that.children[3];
                        cx += qSize;
                        cy -= qSize;
                        qSize = eSize;
                    } else {
                        that = that.children[2];
                        cx -= qSize;
                        cy -= qSize;
                        qSize = eSize;
                    }
                }
            }
        }

        if (!found) { throw new Error("Could not find obj to update"); }

        // propagate upwards until the object can fit in the child
        let stack;

        while (true) {
            const hSize = qSize * 2;
            if (
                cx - hSize < newX - radius &&
                cx + hSize > newX + radius &&
                cy - hSize < newY - radius &&
                cy + hSize > newY + radius
            ) {
                break;
            }

            stack = treeStack.pop();
            if (!stack) {
                break;
            }
            that = stack[0];
            cx = stack[1];
            cy = stack[2];
            qSize = stack[3];
        }

        // propagate back downwards to last child which can contain the obj
        while (true) {
            eSize = qSize / 2;

            if (that.children === null) {
                // add to leaf
                that.elements.push(obj);
                if (that.elements.length > CircleQuadTree.leafMax) {
                    this.growLeaf(that, cx, cy);
                }
                break;
            } else {
                if (newY > cy) {
                    if (newX > cx) {
                        if (newX - radius >= cx && newY - radius >= cy) {
                            that = that.children[0];
                            cx += qSize;
                            cy += qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj); // put on branch if can't fully fit in leaf
                            break;
                        }
                    } else {
                        if (newX + radius <= cx && newY - radius >= cy) {
                            that = that.children[1];
                            cx -= qSize;
                            cy += qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    }
                } else {
                    if (newX > cx) {
                        if (newX - radius >= cx && newY + radius <= cy) {
                            that = that.children[3];
                            cx += qSize;
                            cy -= qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    } else {
                        if (newX + radius <= cx && newY + radius <= cy) {
                            that = that.children[2];
                            cx -= qSize;
                            cy -= qSize;
                            qSize = eSize;
                        } else {
                            that.elements.push(obj);
                            break;
                        }
                    }
                }
            }
        }
    }

    public remove(obj: T): void {
        const x = obj.quadTreeX;
        const y = obj.quadTreeY;

        let that: QuadTreeChild<T> = this;
        let cx: number = this.halfSize;
        let cy: number = this.halfSize;
        let qSize: number = this.halfSize / 2;
        let eSize!: number;

        while (true) {
            eSize = qSize / 2;
            for (let i = that.elements.length - 1; i >= 0; i--) {
                if (that.elements[i] === obj) {
                    that.elements.splice(i, 1);
                    return;
                }
            }

            if (that.children === null) {
                throw new Error("Could not find obj for removal");
            } else {
                if (y > cy) {
                    if (x > cx) {
                        that = that.children[0];
                        cx += qSize
                        cy += qSize
                        qSize = eSize;
                    } else {
                        that = that.children[1];
                        cx -= qSize;
                        cy += qSize;
                        qSize = eSize;
                    }
                } else {
                    if (x > cx) {
                        that = that.children[3];
                        cx += qSize;
                        cy -= qSize;
                        qSize = eSize;
                    } else {
                        that = that.children[2];
                        cx -= qSize;
                        cy -= qSize;
                        qSize = eSize;
                    }
                }
            }
        }
    }

    public queryOne(x: number, y: number, radius: number, exclude?: T): T | undefined {
        // possible optimization: check if query only collides with 3 quadrants

        // as an alternative to recursive
        /** [child, cx, cy, halfSize of child] */
        const que: [QuadTreeChild<T>, number, number, number][] = [
            [this, this.halfSize, this.halfSize, this.halfSize / 2]
        ];

        let queItem;
        while (queItem = que.shift()) {
            const that = queItem[0];

            if (that.children !== null) {
                const cx = queItem[1];
                const cy = queItem[2];
                const qSize = queItem[3];
                const eSize = qSize / 2;

                if (y > cy) {
                    if (x > cx) {
                        que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                        if (x - radius < cx) {
                            que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                            if (y - radius < cy) {
                                que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                                que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
                            }
                        } else {
                            if (y - radius < cy) {
                                que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
                            }
                        }
                    } else {
                        que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                        if (x + radius > cx) {
                            que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                            if (y - radius < cy) {
                                que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                                que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
                            }
                        } else {
                            if (y - radius < cy) {
                                que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                            }
                        }
                    }
                } else {
                    if (x > cx) {
                        que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
                        if (x - radius < cx) {
                            que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                            if (y + radius > cy) {
                                que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                                que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                            }
                        } else {
                            if (y + radius > cy) {
                                que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                            }
                        }
                    } else {
                        que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                        if (x + radius > cx) {
                            que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
                            if (y + radius > cy) {
                                que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                                que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                            }
                        } else {
                            if (y + radius > cy) {
                                que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                            }
                        }
                    }
                }
            }

            for (let i = that.elements.length - 1; i >= 0; i--) {
                if (that.elements[i] === exclude) { continue; }

                const element = that.elements[i];
                const dx = element.x - x;
                const dy = element.y - y;
                const r = element.radius + radius;

                if (dx * dx + dy * dy < r * r) {
                    return element;
                }
            }
        }
    }

    public debugRender(X: CanvasRenderingContext2D): void {
        X.beginPath();
        X.strokeStyle = "#ff8888";
        X.lineWidth = 1;

        // as an alternative to recursive
        /** [child, cx, cy, halfSize of child] */
        const que: [QuadTreeChild<T>, number, number, number][] = [
            [this, this.halfSize, this.halfSize, this.halfSize / 2]
        ];

        let queItem;
        while (queItem = que.shift()) {
            const that = queItem[0];
            const cx = queItem[1];
            const cy = queItem[2];
            const qSize = queItem[3];
            const eSize = qSize / 2;

            if (that.children === null) {
                const hSize = qSize * 2;
                X.rect(cx - hSize, cy - hSize, hSize * 2, hSize * 2);
            } else {
                que.push([that.children[0], cx + qSize, cy + qSize, eSize]);
                que.push([that.children[1], cx - qSize, cy + qSize, eSize]);
                que.push([that.children[2], cx - qSize, cy - qSize, eSize]);
                que.push([that.children[3], cx + qSize, cy - qSize, eSize]);
            }
        }

        X.stroke();
    }

    private growLeaf(that: QuadTreeChild<T>, cx: number, cy: number): void {
        // grow the leaf into a branch
        that.children = [
            createQuadTreeChild(),
            createQuadTreeChild(),
            createQuadTreeChild(),
            createQuadTreeChild(),
        ];

        const oldElements = that.elements;
        that.elements = [];

        // put elements into the leaves
        for (let i = oldElements.length - 1; i >= 0; i--) {
            const element = oldElements[i];
            const x = element.quadTreeX;
            const y = element.quadTreeY;
            const radius = element.radius;

            if (y > cy) {
                if (x > cx) {
                    if (x - radius >= cx && y - radius >= cy) {
                        that.children![0].elements.push(element);
                    } else {
                        that.elements.push(element); // put on branch if can't fully fit in new leaf
                    }
                } else {
                    if (x + radius <= cx && y - radius >= cy) {
                        that.children![1].elements.push(element);
                    } else {
                        that.elements.push(element);
                    }
                }
            } else {
                if (x > cx) {
                    if (x - radius >= cx && y + radius <= cy) {
                        that.children![3].elements.push(element);
                    } else {
                        that.elements.push(element);
                    }
                } else {
                    if (x + radius <= cx && y + radius <= cy) {
                        that.children![2].elements.push(element);
                    } else {
                        that.elements.push(element);
                    }
                }
            }
        }
    }
}

function createQuadTreeChild<T>(): QuadTreeChild<T> {
    return {
        elements: [],
        children: null
    };
}

interface QuadTreeChild<T> {
    elements: T[];
    children: QuadTreeChild<T>[] | null;
}

interface Circle {
    x: number;
    y: number;
    radius: number;
}

export default CircleQuadTree;