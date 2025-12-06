import { numToString } from "./modules/utils.js";
import { parsePomodoroInput } from "./modules/utils.js";
import { state } from "./modules/state.js";


let intervalId = null;
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const selected = document.querySelector('input[name="pomodoroOption"]:checked');


const timerDisplay = document.getElementById("timerDisplay");

const workState = document.getElementById("workState");


const pomodoroTime = document.getElementById("pomodoroTime");
const shortBreakTime = document.getElementById("shortBreakTime");
const longBreakTime = document.getElementById("longBreakTime");



const toggle1Button = document.getElementById("toggle1");
const toggle2Button = document.getElementById("toggle2");



startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

document.querySelectorAll('input[name="pomodoroOption"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        const value = e.target.value;
        console.log("Seleccionado:", value);
        state.currentMode = value;
    });
});



let timeText = timerDisplay.innerText;
let minutes = parseInt(timeText.split(":")[0], 10);
let seconds = parseInt(timeText.split(":")[1], 10);


state.currentMode = selected; // 1 = pomodoro (work) / 2 = short break / 3 = long break
state.minutes = minutes; 
state.seconds = seconds; 
state.running = intervalId == null ? false : true; 
state.completedPomodoros = 0;





function updateTimerUI() {
    if (state.minutes === 0 && state.seconds === 0) {
        if (state.currentMode === "1") {
            pauseTimer();
            startTimer();
            state.completedPomodoros++;
            if (state.completedPomodoros >= 4) {
                let userInput = parsePomodoroInput(longBreakTime.value)
                state.currentMode = "3";
                state.completedPomodoros = 0;
                workState.innerText = "Long Break!"
                if (userInput != null) {
                    state.minutes = userInput;
                } else {
                    state.minutes = 20;
                }
            } else {
                let userInput = parsePomodoroInput(shortBreakTime.value)
                state.currentMode = "2";
                workState.innerText = "Short Break!"
                if (userInput != null) {
                    state.minutes = userInput;
                } else {
                    state.minutes = 5;
                }
            }

        } else if (state.currentMode === "2"){
            pauseTimer();
            let userInput = parsePomodoroInput(pomodoroTime.value)
            if (userInput != null) {
                state.minutes = userInput;
            } else {
                state.minutes = 25;
            }
            startTimer();

            state.currentMode = "1";
            workState.innerText = "Work!"
        } else {
            pauseTimer();
            let userInput = parsePomodoroInput(pomodoroTime.value)
            if (userInput != null) {
                state.minutes = userInput;
            } else {
                state.minutes = 25;
            }
            startTimer();
            state.currentMode = "1";
            workState.innerText = "Work!"
        }


    } else {
        if (state.seconds === 0) {
            state.minutes--;
            state.seconds = 59;
        } else {
            state.seconds--;
        }
    }
    
    let minutesStr = numToString(state.minutes);
    let secondsStr = numToString(state.seconds);
    
    timerDisplay.innerText = `${minutesStr}:${secondsStr}`;
}

function startTimer() {
    if (intervalId !== null) return; // impedir duplicados
    intervalId = setInterval(updateTimerUI, 100);
}

function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

function resetTimer() {
    let userInput;
    if (state.currentMode === "1") {
        userInput = parsePomodoroInput(pomodoroTime.value);
    } else if (state.currentMode === "2") {
        userInput = parsePomodoroInput(shortBreakTime.value);
    } else {
        userInput = parsePomodoroInput(longBreakTime.value);
    }

    if (userInput != null) {
        timerDisplay.innerText = `${userInput}:00`;
        state.minutes = parseInt(userInput);
        state.seconds = 0;
    }
}