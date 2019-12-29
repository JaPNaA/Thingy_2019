var HorizontalSelect = (function () {
    function HorizontalSelect(elm) {
        this.elm = elm;
        this.selectElm = this.getSelectElm();
        this.optionElms = [];
        this.setup();
    }
    HorizontalSelect.prototype.setup = function () {
        for (var i = 0, length_1 = this.selectElm.children.length; i < length_1; i++) {
            var option = this.selectElm[i];
            var optionElm = document.createElement("span");
            optionElm.classList.add("selectOption");
            optionElm.innerText = option.innerHTML;
            optionElm.setAttribute("data-value", option.value);
            this.addOptionClickListener(optionElm);
            this.optionElms.push(optionElm);
            this.elm.appendChild(optionElm);
        }
        if (this.selectElm.value) {
            this.setValueWithString(this.selectElm.value);
        }
    };
    HorizontalSelect.prototype.addOptionClickListener = function (elm) {
        var _this = this;
        elm.addEventListener("click", function () {
            _this.setValueWithOptionElm(elm);
        });
    };
    HorizontalSelect.prototype.setValueWithString = function (value) {
        for (var _i = 0, _a = this.optionElms; _i < _a.length; _i++) {
            var elm = _a[_i];
            if (elm.getAttribute("data-value") === value) {
                this.setValueWithOptionElm(elm);
                break;
            }
        }
    };
    HorizontalSelect.prototype.setValueWithOptionElm = function (optionElm) {
        for (var _i = 0, _a = this.optionElms; _i < _a.length; _i++) {
            var otherOptionElm = _a[_i];
            otherOptionElm.classList.remove("selected");
        }
        this.selectElm.value = optionElm.getAttribute("data-value");
        optionElm.classList.add("selected");
    };
    HorizontalSelect.prototype.getSelectElm = function () {
        var selectElm = this.elm.getElementsByTagName("select")[0];
        if (!selectElm) {
            throw new Error("The element doesn't have a <select> child");
        }
        return selectElm;
    };
    return HorizontalSelect;
}());
export default HorizontalSelect;
