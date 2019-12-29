var _Views = (function () {
    function _Views() {
        this.switching = false;
        this.que = [];
    }
    _Views.prototype.switch = function (view) {
        if (this.switching) {
            this.que.push(view);
            return;
        }
        this.switching = true;
        if (this.activeView) {
            this.activeView.close();
        }
        view.open();
        this.activeView = view;
        this.switching = false;
        this.flushQue();
    };
    _Views.prototype.flushQue = function () {
        var que = this.que;
        this.que = [];
        for (var _i = 0, que_1 = que; _i < que_1.length; _i++) {
            var view = que_1[_i];
            this.switch(view);
        }
    };
    return _Views;
}());
var views = new _Views;
export default views;
