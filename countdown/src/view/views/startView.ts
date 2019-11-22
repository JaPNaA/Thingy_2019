import View from "../view.js";
import views from "../views.js";
import countdownView from "./countdownView.js";
import { getElmById } from "../../utils.js";

class _StartView extends View {
    constructor() {
        super(getElmById("start"));
        this.setup();
    }

    private setup() {
        const submitButton = getElmById("selectSubmit");
        submitButton.addEventListener("click", function () {
            views.switch(countdownView);
        })
    }
}
const startView = new _StartView();
export default startView;