export function log(...args) {
    console.log("[LOG]:", ...args);
}


export function numToString(num) {
    return String(num).padStart(2, "0");
}



export function parsePomodoroInput(raw) {
    // borrar espacios, borrar ceros adelante
    let cleaned = raw.trim().replace(/^0+/, "");

    // si quedó vacío → inválido
    if (cleaned === "") return null;

    // debe ser entero puro
    if (!/^\d+$/.test(cleaned)) return null;

    let num = Number(cleaned);

    // rango permitido 1–59
    if (num < 1 || num > 59) return null;

    // devolver string siempre de 2 dígitos
    return String(num).padStart(2, "0");
}
