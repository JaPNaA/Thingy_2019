var View = (function () {
    function View(elm) {
        this.elm = elm;
    }
    View.prototype.open = function () {
        this.elm.classList.add("open");
    };
    View.prototype.close = function () {
        this.elm.classList.remove("open");
    };
    return View;
}());
export default View;
