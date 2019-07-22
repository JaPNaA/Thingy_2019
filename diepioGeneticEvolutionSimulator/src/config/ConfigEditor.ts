import IInput from "./IInput";

type SubmitHandler<T> = (config: T) => void;

interface InputTree {
    [x: string]: HTMLInputElement | InputTree;
}

class ConfigEditor<T> {
    public changed: boolean;

    private static localStorageKey = "diepGES-config";

    private elm: HTMLDivElement;
    private submitHandler?: SubmitHandler<T>;
    private invalidSubmitionHandler?: Function;
    private config: T;
    private inputTree: InputTree;

    private inputValids: boolean[];
    private submitButton: HTMLButtonElement;
    private restoreButton: HTMLButtonElement;
    private restoreButtonEnabled: boolean;

    private parent?: Node;

    constructor(name: string, config: T) {
        this.changed = false;
        this.elm = document.createElement("div");
        this.elm.classList.add("ConfigEditor");
        this.config = config;
        this.inputValids = [];
        this.restoreButtonEnabled = true;

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

        this.restoreButton = document.createElement("button");
        this.restoreButton.classList.add("restore");
        this.restoreButton.innerHTML = "Restore config";
        this.restoreButton.addEventListener("click", () => {
            if (!this.restoreButtonEnabled) { return; }
            this.restoreConfig(
                this.config,
                JSON.parse(localStorage[ConfigEditor.localStorageKey]),
                this.inputTree
            );
            this.restoreButton.classList.add("disabled");
        });

        if (!localStorage[ConfigEditor.localStorageKey]) {
            this.restoreButtonEnabled = false;
            this.restoreButton.classList.add("disabled");
        }

        this.inputTree = {};

        this.elm.appendChild(this.createConfigTree(name, this.config, this.inputTree));
        this.elm.appendChild(this.submitButton);
        this.elm.appendChild(this.restoreButton);
    }

    public appendTo(parent: Node): void {
        parent.appendChild(this.elm);
        this.parent = parent;
    }

    public saveConfigToLocalStorage(): void {
        localStorage[ConfigEditor.localStorageKey] = JSON.stringify(this.config);
    }

    public remove(): void {
        if (!this.parent) { throw new Error("Was never appended"); }
        this.parent.removeChild(this.elm);
    }

    public setSubmitHandler(handler: SubmitHandler<T>): void {
        this.submitHandler = handler;
    }

    public setInvalidSubmitionHandler(handler: Function): void {
        this.invalidSubmitionHandler = handler;
    }

    private restoreConfig(thisObj: any, otherObj: any, inputTree: InputTree): void {
        const keys = Object.keys(thisObj);

        for (const key of keys) {
            if (typeof thisObj[key] !== typeof otherObj[key]) { continue; }
            if (typeof otherObj[key] !== "object") {
                thisObj[key] = otherObj[key];
                if (typeof thisObj[key] === "boolean") {
                    (inputTree[key] as HTMLInputElement).checked = otherObj[key];
                } else {
                    (inputTree[key] as HTMLInputElement).value = otherObj[key];
                }
            } else {
                this.restoreConfig(thisObj[key], otherObj[key], inputTree[key] as InputTree);
            }
        }
    }

    private allInputsAreValid(): boolean {
        for (const valid of this.inputValids) {
            if (!valid) { return false; }
        }

        return true;
    }

    private createConfigTree(name: string, config: any, inputTree: InputTree, depth: number = 1): HTMLDivElement {
        const section = document.createElement("div");
        const heading = document.createElement("h" + depth);
        const keys = Object.keys(config);

        section.classList.add("section");
        heading.classList.add("heading");
        heading.innerHTML = name;
        section.appendChild(heading);

        for (const key of keys) {
            const obj = config[key];

            switch (typeof obj) {
                case "number": {
                    const { elm, input } = this.createNumberInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "string": {
                    const { elm, input } = this.createStringInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "boolean": {
                    const { elm, input } = this.createBooleanInput(config, key, obj);
                    section.appendChild(elm)
                    inputTree[key] = input;
                    break;
                }
                case "object": {
                    const elmBranch = {} as any;
                    inputTree[key] = elmBranch;
                    section.appendChild(this.createConfigTree(
                        this.formatCamelCase(key),
                        obj, elmBranch, depth + 1
                    ));
                    break;
                }
            }
        }

        return section;
    }

    private createNumberInput(config: any, key: string, value: number): IInput {
        return this.createInput("number", config, value.toString(), key, value => {
            const parsed = parseInt(value);
            if (isNaN(parsed)) { return; }
            return parsed;
        });
    }

    private createStringInput(config: any, key: string, value: string): IInput {
        return this.createInput("text", config, value, key, value => value ? value : undefined);
    }

    private createBooleanInput(config: any, key: string, value: boolean): IInput {
        const elm = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        elm.classList.add("configItem");
        input.type = "checkbox";
        input.checked = value;
        label.innerText = this.formatCamelCase(key);
        elm.appendChild(input);
        elm.appendChild(label);

        input.addEventListener("change", () => {
            this.changed = true;
            config[key] = input.checked;
        });

        return { elm, input };
    }

    private createInput(type: string, config: any, value: string, key: string, parse: (value: string) => any | undefined): IInput {
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
            this.changed = true;
            const parsed = parse(input.value);

            if (parsed === undefined) {
                elm.classList.add("invalid");
                this.inputValids[validIndex] = false;
            } else {
                config[key] = parsed;
            }
        });

        return { elm, input };
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