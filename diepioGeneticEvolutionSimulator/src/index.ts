import ConfigEditor from "./config/ConfigEditor";
import Config from "./config/Config";
import Game from "./game/Game";

const messageDiv = document.createElement("div");
messageDiv.classList.add("message");
function setMessage(str?: string) {
    if (str) {
        messageDiv.innerText = str;
        document.body.appendChild(messageDiv);
    } else {
        document.body.removeChild(messageDiv);
    }
}

const configEditor = new ConfigEditor("Config", new Config());
configEditor.appendTo(document.body);
configEditor.setInvalidSubmitionHandler(() => alert("Invalid config!"));
configEditor.setSubmitHandler(config => {
    setMessage("Creating inital entities...");

    setTimeout(() => {
        configEditor.remove();
        setMessage();

        const game = new Game(config);
        game.appendTo(document.body);

        // @ts-ignore -- debugging purposes
        window.game = game;
    }, 1);
});

setMessage("Adjust the settings if the simulation runs too slowly");