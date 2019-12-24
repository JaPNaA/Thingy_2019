import View from "./view.js";

class _Views {
    private activeView?: View;
    private que: View[];
    private switching = false;

    constructor() {
        this.que = [];
    }

    public switch(view: View) {
        if (this.switching) {
            this.que.push(view);
            return;
        }

        this.switching = true;
        view.open();

        if (this.activeView) {
            this.activeView.close();
        }

        this.activeView = view;
        this.switching = false;

        this.flushQue();
    }

    private flushQue() {
        const que = this.que;
        this.que = [];

        for (const view of que) {
            this.switch(view);
        }
    }
}
const views = new _Views;

export default views;