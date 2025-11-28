console.log("✅ Script de ejercicios cargado correctamente");

// --- Control de los ejercicios visibles ---
let ejercicioActual = 0;
const ejercicios = document.querySelectorAll(".ejercicio");
const Anterior = document.getElementById("btnAnterior");
const Siguiente = document.getElementById("btnSiguiente");
const contador = document.getElementById("contador");

function mostrarEjercicio(index) {
    ejercicios.forEach((ej, i) => {
        ej.style.display = i === index ? 'block' : 'none';
    });
    contador.textContent = `Ejercicio ${index + 1} de ${ejercicios.length}`;
    Anterior.disabled = index === 0;
    Siguiente.disabled = index === ejercicios.length - 1;
}

Anterior.addEventListener("click", () => {
    if (ejercicioActual > 0) {
        ejercicioActual--;
        mostrarEjercicio(ejercicioActual);
    }
});

Siguiente.addEventListener("click", () => {
    if (ejercicioActual < ejercicios.length - 1) {
        ejercicioActual++;
        mostrarEjercicio(ejercicioActual);
    }
});

// Inicializa el carrusel al cargar
if (ejercicios.length > 0) {
    mostrarEjercicio(ejercicioActual);
}

// -------------------------------------------------------------
// |      FUNCIÓN CRÍTICA QUE FALTABA O NECESITABA AJUSTE      |
// -------------------------------------------------------------
/**
 * Actualiza el puntaje total del usuario en la interfaz.
 * Utiliza obtenerPuntajeDesdeServidor() para obtener el valor más preciso.
 */
function actualizarPuntajeTotal() {
    obtenerPuntajeDesdeServidor();
}

// -------------------------------------------------------------

// --- Recuperar datos guardados al cargar ---
window.addEventListener("load", () => {
    const guardados = JSON.parse(localStorage.getItem("resultados")) || [];

    guardados.forEach(res => {
        const { ejercicio, puntaje, color } = res;

        const display = document.getElementById(`puntajeDisplay${ejercicio}`);
        if (display) display.textContent = `Puntaje: ${puntaje}`;

        const semaforo = document.querySelector(`#semaforo${ejercicio}`);
        if (semaforo && color) {
            semaforo.querySelectorAll(".luz").forEach(l => l.classList.remove("on"));
            semaforo.querySelector(`.${color}`).classList.add("on");
        }
    });

    actualizarPuntajeTotal();
});

// --- Enviar resultado (EJERCICIOS SIMPLES 1-5) ---
async function guardarYEnviar(numEjercicio) {
    const usuario = localStorage.getItem("usuarioActivo") || "Invitado";
    const input = document.querySelector(`#ejercicio${numEjercicio} input`);
    const valor = input.value || "0";

    // 🧩 Obtener resultados guardados localmente
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    // ⚠️ Verificar si ya fue correcto antes
    const existente = resultados.find(r => r.ejercicio === numEjercicio && r.color === "green");
    if (existente) {
        alert("✅ Ya respondiste correctamente este ejercicio. No puedes ganar más puntos.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/guardar_resultado/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuario,
                ejercicio: numEjercicio,
                respuesta: valor,
                puntaje: 0
            })
        });

        const resultado = await response.json();
        console.log("📡 Servidor respondió:", resultado);

        const color = resultado.color; 
        const puntaje = resultado.puntaje;

        // 🎯 Actualizar puntaje visual
        const display = document.getElementById(`puntajeDisplay${numEjercicio}`);
        if (display) display.textContent = `Puntaje: ${puntaje}`;

        // 🚦 Cambiar semáforo
        const semaforo = document.querySelector(`#semaforo${numEjercicio}`);
        if (semaforo) {
            semaforo.querySelectorAll(".luz").forEach(l => l.classList.remove("on")); 
            semaforo.querySelector(`.${color}`).classList.add("on"); 
        }

        // 💬 Mensaje de retroalimentación
        let mensaje = "";
        if (color === "green") mensaje = "✅ ¡Correcto!";
        else if (color === "yellow") mensaje = "🟡 Casi correcto";
        else mensaje = "❌ Incorrecto";
        alert(mensaje);

        // 💾 Actualizar localStorage
        const indiceExistente = resultados.findIndex(r => r.ejercicio === numEjercicio);
        const nuevoResultado = {
            ejercicio: numEjercicio,
            respuesta: valor,
            puntaje,
            color,
            fecha: new Date().toLocaleString(),
        };

        if (indiceExistente !== -1) resultados[indiceExistente] = nuevoResultado;
        else resultados.push(nuevoResultado);

        localStorage.setItem("resultados", JSON.stringify(resultados));

        // 🔁 Actualizar puntaje total
        actualizarPuntajeTotal(); 

    } catch (error) {
        console.error("❌ Error al enviar resultado:", error);
        alert("Error al conectar con el servidor.");
    }
}

// --- Enviar resultado (EJERCICIO MÚLTIPLE 6) ---
async function guardarYEnviarMultiples(numEjercicio) {
    const usuario = localStorage.getItem("usuarioActivo") || "Invitado";
    
    // Obtener todas las respuestas del ejercicio múltiple
    const respuestas = obtenerRespuestasMultiples(numEjercicio);
    
    // 🧩 Obtener resultados guardados localmente
    let resultados = JSON.parse(localStorage.getItem("resultados")) || [];

    // ⚠️ Verificar si ya fue correcto antes
    const existente = resultados.find(r => r.ejercicio === numEjercicio && r.color === "green");
    if (existente) {
        alert("✅ Ya respondiste correctamente este ejercicio. No puedes ganar más puntos.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/guardar_resultado/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuario,
                ejercicio: numEjercicio,
                respuesta: JSON.stringify(respuestas), // Enviamos todas las respuestas como JSON
                puntaje: 0
            })
        });

        const resultado = await response.json();
        console.log("📡 Servidor respondió:", resultado);

        const color = resultado.color; 
        const puntaje = resultado.puntaje;

        // 🎯 Actualizar puntaje visual
        const display = document.getElementById(`puntajeDisplay${numEjercicio}`);
        if (display) display.textContent = `Puntaje: ${puntaje}`;

        // 🚦 Cambiar semáforo
        const semaforo = document.querySelector(`#semaforo${numEjercicio}`);
        if (semaforo) {
            semaforo.querySelectorAll(".luz").forEach(l => l.classList.remove("on")); 
            semaforo.querySelector(`.${color}`).classList.add("on"); 
        }

        // 💬 Mensaje de retroalimentación
        let mensaje = "";
        if (color === "green") mensaje = "✅ ¡Correcto!";
        else if (color === "yellow") mensaje = "🟡 Casi correcto";
        else mensaje = "❌ Incorrecto";
        alert(mensaje);

        // 💾 Actualizar localStorage
        const indiceExistente = resultados.findIndex(r => r.ejercicio === numEjercicio);
        const nuevoResultado = {
            ejercicio: numEjercicio,
            respuesta: JSON.stringify(respuestas),
            puntaje,
            color,
            fecha: new Date().toLocaleString(),
        };

        if (indiceExistente !== -1) resultados[indiceExistente] = nuevoResultado;
        else resultados.push(nuevoResultado);

        localStorage.setItem("resultados", JSON.stringify(resultados));

        // 🔁 Actualizar puntaje total
        actualizarPuntajeTotal(); 

    } catch (error) {
        console.error("❌ Error al enviar resultado:", error);
        alert("Error al conectar con el servidor.");
    }
}

// --- Función para obtener múltiples respuestas ---
function obtenerRespuestasMultiples(numEjercicio) {
    return {
        a: {
            valor: document.getElementById(`respuesta${numEjercicio}a`).value,
            unidad: document.getElementById(`unidad${numEjercicio}a`).value
        },
        b: {
            valor: document.getElementById(`respuesta${numEjercicio}b`).value,
            unidad: document.getElementById(`unidad${numEjercicio}b`).value
        },
        c: {
            valor: document.getElementById(`respuesta${numEjercicio}c`).value,
            unidad: document.getElementById(`unidad${numEjercicio}c`).value
        },
        d: {
            valor: document.getElementById(`respuesta${numEjercicio}d`).value,
            unidad: document.getElementById(`unidad${numEjercicio}d`).value
        }
    };
}

// --- Función para obtener respuesta simple con unidad ---
function obtenerRespuestaConUnidad(numEjercicio) {
    const respuesta = document.getElementById(`respuesta${numEjercicio}`).value;
    const unidad = document.getElementById(`unidad${numEjercicio}`).value;
    return {
        valor: respuesta,
        unidad: unidad
    };
}

async function obtenerPuntajeDesdeServidor() {
    const usuario = localStorage.getItem("usuarioActivo");
    if (!usuario) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/puntaje_total/${usuario}`);
        const data = await res.json();

        const totalDisplay = document.getElementById("puntajeUsuarioDisplay");
        if (totalDisplay) {
            totalDisplay.textContent = `Puntaje total: ${data.puntaje_total}`;
        }
    } catch (error) {
        console.error("❌ Error al obtener puntaje:", error);
    }
}

// Llamar al cargar la página
window.addEventListener("load", obtenerPuntajeDesdeServidor);

// --- Funciones auxiliares (opcionales) ---
function guardarResultado(numEjercicio) {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    const input = document.querySelector(`#ejercicio${numEjercicio} input`);
    const valor = input ? input.value || 0 : 0;

    const nuevoResultado = {
        ejercicio: numEjercicio,
        respuesta: valor,
        puntaje: "100",
        fecha: new Date().toLocaleString(),
    };

    resultados.push(nuevoResultado);
    localStorage.setItem("resultados", JSON.stringify(resultados));

    alert(`✅ Resultado del ejercicio ${numEjercicio} guardado.`);
    console.log("Guardado:", nuevoResultado);
}

function mostrarResultados() {
    const resultados = JSON.parse(localStorage.getItem("resultados")) || [];
    console.table(resultados);
    return resultados;
}

function limpiarResultados() {
    localStorage.removeItem("resultados");
    alert("🧹 Resultados eliminados.");
}