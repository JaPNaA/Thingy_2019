class View {
    protected elm: HTMLElement;

    public constructor(elm: HTMLElement) {
        this.elm = elm;
    }

    public open() {
        this.elm.classList.add("open");
    }

    public close() {
        this.elm.classList.remove("open");
    }
}

export default View;