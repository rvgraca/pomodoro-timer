import { createElement } from "./modules/dom.js";
import { log } from "./modules/utils.js";


let intervalId = null;

function startTimer() {
    if (intervalId !== null) return; // impedir duplicados
    intervalId = setInterval(() => {
        // lógica de countdown
    }, 1000);
}

function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
}
