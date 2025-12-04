import { createElement } from "./modules/dom.js";
import { log } from "./modules/utils.js";
import {esDebil} from "./modules/utils.js"

const inputForm = document.getElementById("passwordInput");
const showPasswordCheckbox = document.getElementById("showPasswordCheckbox");
const progressBar = document.getElementById("passwordProgress");
const validationMessage = document.getElementById("validationMessage");
const passwordProgressValue = document.getElementById("passwordProgressValue");



const rulesElements = [
    document.getElementById("rule-length"),
    document.getElementById("rule-uppercase"),
    document.getElementById("rule-lowercase"),
    document.getElementById("rule-special"),
    document.getElementById("rule-number"),
    document.getElementById("rule-pattern"),
];


const validationRules = {
    length: false, // Min 12 caracteres
    uppercase: false, // Al menos 1 mayúscula
    lowercase: false, // Al menos 1 minúscula
    specialChar: false, // Al menos 1 caracter especial (símbolo)
    number: false, // Al menos 1 número
    pattern: false // Que NO siga un patrón obvio (ej: 123, abc). Inicialmente True.
};


inputForm.addEventListener("input", checkPasswordStrength);

function checkPasswordStrength(e) {
    const inputText = e.target.value;
    
    validationRules.length = inputText.length > 12 ? true : false;
    validationRules.uppercase = /[A-Z]/.test(inputText);
    validationRules.lowercase = /[a-z]/.test(inputText);
    validationRules.number = /[0-9]/.test(inputText);
    validationRules.specialChar = /[!@#$%^&*()_\-+=\[\]{};:'",.<>\/?\\|`~]/.test(inputText);
    validationRules.pattern = !esDebil(inputText); 
    let strength = calculateStrength(validationRules);


    progressBar.value = strength;
    passwordProgressValue.innerText = Math.round(strength, 2) + "%"

    const ruleValues = Object.values(validationRules); 
    for (let i = 0; i < ruleValues.length; i++) {
        if (ruleValues[i] === true) {
            rulesElements[i].style.color = "#16a34a";
            
        } else {
            rulesElements[i].style.color = "#f00";
        }
    }

}

showPasswordCheckbox.addEventListener("change", () => {
    if (showPasswordCheckbox.checked) {
        inputForm.type = "text";
    } else {
        inputForm.type = "password";
    }
});


function calculateStrength(rules) {
    let passedCount = 0;
    const totalRules = Object.keys(rules).length;

    for (const rule in rules) {
        if (rules[rule] === true) {
            passedCount++;
        }
    }
    const progressBar = (passedCount/totalRules) *100;
    return progressBar;
}