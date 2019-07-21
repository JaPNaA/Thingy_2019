type SubmitHandler<T> = (config: T) => void;

class ConfigEditor<T> {
    private elm: HTMLDivElement;
    private submitHandler?: SubmitHandler<T>;
    private invalidSubmitionHandler?: Function;
    private config: T;

    private inputValids: boolean[];
    private submitButton: HTMLButtonElement;

    private parent?: Node;

    constructor(name: string, config: T) {
        this.elm = document.createElement("div");
        this.elm.classList.add("ConfigEditor");
        this.config = config;
        this.inputValids = [];

        this.submitButton = document.createElement("button");
        this.submitButton.classList.add("submit");
        this.submitButton.innerHTML = "Start the simulation!";
        this.submitButton.addEventListener("click", () => {
            if (this.allInputsAreValid()) {
                if (this.submitHandler) {
                    this.submitHandler(this.config);
                }
            } else if (this.invalidSubmitionHandler) {
                this.invalidSubmitionHandler();
            }
        });

        this.elm.appendChild(this.createConfigTree(name, this.config));
        this.elm.appendChild(this.submitButton);
    }

    public appendTo(parent: Node) {
        parent.appendChild(this.elm);
        this.parent = parent;
    }

    public remove() {
        if (!this.parent) { throw new Error("Was never appended"); }
        this.parent.removeChild(this.elm);
    }

    public setSubmitHandler(handler: SubmitHandler<T>): void {
        this.submitHandler = handler;
    }

    public setInvalidSubmitionHandler(handler: Function): void {
        this.invalidSubmitionHandler = handler;
    }

    private allInputsAreValid(): boolean {
        for (const valid of this.inputValids) {
            if (!valid) { return false; }
        }

        return true;
    }

    private createConfigTree(name: string, config: any, depth: number = 1): HTMLDivElement {
        const elm = document.createElement("div");
        const heading = document.createElement("h" + depth);
        const keys = Object.keys(config);

        elm.classList.add("section");
        heading.classList.add("heading");
        heading.innerHTML = name;
        elm.appendChild(heading);

        for (const key of keys) {
            const obj = config[key];

            switch (typeof obj) {
                case "number":
                    elm.appendChild(this.createNumberInput(config, key, obj));
                    break;
                case "string":
                    elm.appendChild(this.createStringInput(config, key, obj));
                    break;
                case "boolean":
                    elm.appendChild(this.createBooleanInput(config, key, obj));
                    break;
                case "object":
                    elm.appendChild(this.createConfigTree(
                        this.formatCamelCase(key),
                        obj, depth + 1
                    ));
                    break;
            }
        }

        return elm;
    }

    private createNumberInput(config: any, key: string, value: number): HTMLDivElement {
        return this.createInput("number", config, value.toString(), key, value => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) { return; }
            return parsed;
        });
    }

    private createStringInput(config: any, key: string, value: string): HTMLDivElement {
        return this.createInput("text", config, value, key, value => value ? value : undefined);
    }

    private createBooleanInput(config: any, key: string, value: boolean): HTMLDivElement {
        const elm = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = value;
        label.innerText = this.formatCamelCase(key);
        elm.appendChild(input);
        elm.appendChild(label);

        input.addEventListener("change", () => {
            config[key] = input.checked;
        });

        return elm;
    }

    private createInput(type: string, config: any, value: string, key: string, parse: (value: string) => any | undefined): HTMLDivElement {
        const elm = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        const validIndex = this.inputValids.push(true);
        elm.classList.add("configItem");
        input.type = type;
        input.value = value;
        label.innerText = this.formatCamelCase(key);
        elm.appendChild(label);
        elm.appendChild(input);

        input.addEventListener("change", () => {
            elm.classList.remove("invalid");
            this.inputValids[validIndex] = true;
            const parsed = parse(input.value);

            if (parsed === undefined) {
                elm.classList.add("invalid");
                this.inputValids[validIndex] = false;
            } else {
                config[key] = parsed;
            }
        });

        return elm;
    }

    private formatCamelCase(str: string): string {
        const words = str.split(/(?=[a-zA-Z])(?=[A-Z])/g);
        const length = words.length;

        {
            const word = words[0];
            words[0] = word[0].toUpperCase() + word.slice(1);
        }

        for (let i = 1; i < length; i++) {
            const word = words[i];
            words[i] = word[0].toLowerCase() + word.slice(1);
        }

        return words.join(" ");
    }
}

export default ConfigEditor;