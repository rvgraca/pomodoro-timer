export function log(...args) {
    console.log("[LOG]:", ...args);
}


function tieneSecuenciaAscendente(str, minimo = 3) {
    let count = 1;
    for (let i = 1; i < str.length; i++) {
        const prev = str.charCodeAt(i - 1);
        const curr = str.charCodeAt(i);
        if (curr === prev + 1) {
        if (++count >= minimo) return true;
        } else {
        count = 1;
        }
    }
    return false;
}

function tieneSecuenciaDescendente(str, minimo = 3) {
    let count = 1;
    for (let i = 1; i < str.length; i++) {
        const prev = str.charCodeAt(i - 1);
        const curr = str.charCodeAt(i);
        if (curr === prev - 1) {
        if (++count >= minimo) return true;
        } else {
        count = 1;
        }
    }
    return false;
}

function regexRepeticiones(text)       { return /(.)\1{2,}/.test(text); }
function regexNumericaLarga(text)      { return /\d{3,}/.test(text); }

const patronesComunes = [
    "qwerty", "asdf", "zxcv", "password", "admin", "welcome",
    "abc123", "letmein", "123456"
];

function tienePatronComun(str) {
    const lower = str.toLowerCase();
    return patronesComunes.some(p => lower.includes(p));
}

export function esDebil(password, score=false) {
    if (score) {
        let puntuacion = 0;
        if (tieneSecuenciaAscendente(password))   puntuacion--;
        if (tieneSecuenciaDescendente(password))  puntuacion--;
        if (regexRepeticiones(password))          puntuacion--;
        if (regexNumericaLarga(password))         puntuacion--;
        if (tienePatronComun(password))           puntuacion--;
        return puntuacion;
    } else {
        let output = false;
        if (tieneSecuenciaAscendente(password))   return true;
        if (tieneSecuenciaDescendente(password))  return true;
        if (regexRepeticiones(password))          return true;
        if (regexNumericaLarga(password))         return true;
        if (tienePatronComun(password))           return true;
        return output;
    }
}
