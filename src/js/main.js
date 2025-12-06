import { numToString } from "./modules/utils.js";
import { parsePomodoroInput } from "./modules/utils.js";
import { state } from "./modules/state.js";





let intervalId = null;
let playSound = true;
let pomodoroSequence = true;

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

const pomodoroStatus = document.querySelector('input[value="1"]');
const shortBreakStatus = document.querySelector('input[value="2"]');
const longBreakStatus = document.querySelector('input[value="3"]');


const timerDisplay = document.getElementById("timerDisplay");
const pomodorosCounter = document.getElementById("pomodorosDisplay");
const workState = document.getElementById("workState");


const pomodoroTime = document.getElementById("pomodoroTime");
const shortBreakTime = document.getElementById("shortBreakTime");
const longBreakTime = document.getElementById("longBreakTime");



const toggleSoundButton = document.getElementById("toggle1");
const togglePomodoroSequence = document.getElementById("toggle2");


const MODES = {
    "1": { label: "Work!", default: 25, input: pomodoroTime },
    "2": { label: "Short Break!", default: 5, input: shortBreakTime },
    "3": { label: "Long Break!", default: 20, input: longBreakTime }
};


startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

toggleSoundButton.addEventListener("change", () => {playSound = !playSound});
togglePomodoroSequence.addEventListener("change", () => {pomodoroSequence = !pomodoroSequence});


document.querySelectorAll('input[name="pomodoroOption"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        handleModeChange(e.target.value);
    });
});



const initialRadio = document.querySelector('input[name="pomodoroOption"]:checked');
if (initialRadio) {
    handleModeChange(initialRadio.value);
}


function handleModeChange(mode) {
    state.currentMode = mode;
    const cfg = MODES[mode];
    workState.innerText = cfg.label;
    const userTime = parsePomodoroInput(cfg.input.value);
    state.minutes = userTime ?? cfg.default;
    state.seconds = 0;
    timerDisplay.innerText = `${numToString(state.minutes)}:${numToString(state.seconds)}`;
}

function updateTimerUI() {
    if (state.minutes === 0 && state.seconds === 0) {
        if (!pomodoroSequence) {
            pauseTimer();
        } else {
            switch (state.currentMode) {
                case "1":
                    state.completedPomodoros++;
                    if (state.completedPomodoros > 3) {
                        state.currentMode = "3";
                        longBreakStatus.checked = true;
                        state.minutes = parsePomodoroInput(longBreakTime.value) ?? 20;

                    } else {
                        state.currentMode = "2";
                        shortBreakStatus.checked = true;
                        state.minutes = parsePomodoroInput(shortBreakTime.value) ?? 5;
                    }
                    break;
                
                case "2":
                    state.currentMode = "1";
                    pomodoroStatus.checked = true;
                    state.minutes = parsePomodoroInput(pomodoroTime.value) ?? 25;
                    
                    break;
                
                case "3":
                    state.completedPomodoros = 0;
                    state.currentMode = "1";
                    pomodoroStatus.checked = true;
                    state.minutes = parsePomodoroInput(pomodoroTime.value) ?? 25;
                    break;
            }
        }
        if (playSound) playAlarm();
        handleModeChange(state.currentMode);
    } else {
        if (state.seconds === 0) {
            state.minutes--;
            state.seconds = 59;
        } else {
            state.seconds--;
        }
    }

    
    pomodorosCounter.innerText = "Pomodoros: " + state.completedPomodoros;
    timerDisplay.innerText = `${numToString(state.minutes)}:${numToString(state.seconds)}`;
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


function playBeep() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 880; // tono agudo
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3); // dura 0.3s
}


const alarmSound = document.getElementById("alarmSound");

function playAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.play();
}