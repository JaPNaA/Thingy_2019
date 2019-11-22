import View from "./view.js";

class _Views {
    private activeView?: View;

    constructor() { }

    public switch(view: View) {
        view.open();

        if (this.activeView) {
            this.activeView.close();
        }

        this.activeView = view;
    }
}
const views = new _Views;

export default views;



