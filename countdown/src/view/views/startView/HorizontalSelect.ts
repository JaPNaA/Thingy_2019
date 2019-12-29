export default class HorizontalSelect {
    private selectElm: HTMLSelectElement;
    private optionElms: HTMLElement[];

    constructor(private elm: HTMLElement) {
        this.selectElm = this.getSelectElm();
        this.optionElms = [];
        this.setup();
    }

    private setup(): void {
        for (let i = 0, length = this.selectElm.children.length; i < length; i++) {
            const option = this.selectElm[i] as HTMLOptionElement;
            const optionElm = document.createElement("span");

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
    }

    private addOptionClickListener(elm: HTMLElement): void {
        elm.addEventListener("click", () => {
            this.setValueWithOptionElm(elm);
        });
    }

    private setValueWithString(value: string): void {
        for (const elm of this.optionElms) {
            if (elm.getAttribute("data-value") === value) {
                this.setValueWithOptionElm(elm);
                break;
            }
        }
    }

    private setValueWithOptionElm(optionElm: HTMLElement): void {
        for (const otherOptionElm of this.optionElms) {
            otherOptionElm.classList.remove("selected");
        }

        this.selectElm.value = optionElm.getAttribute("data-value")!;
        optionElm.classList.add("selected");
    }

    private getSelectElm(): HTMLSelectElement {
        const selectElm = this.elm.getElementsByTagName("select")[0];
        if (!selectElm) { throw new Error("The element doesn't have a <select> child"); }
        return selectElm;
    }
}