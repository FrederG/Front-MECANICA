console.log("✅ Script de ejercicios cargado correctamente");

// --- Control de ejercicios visibles ---
let ejercicioActual = 0;
const ejercicios = document.querySelectorAll(".ejercicio");
const Anterior = document.getElementById("btnAnterior");
const Siguiente = document.getElementById("btnSiguiente");
const contador = document.getElementById("contador");

function mostrarEjercicio(index) {
  ejercicios.forEach((ej, i) => {
    ej.style.display = i === index ? "block" : "none";
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

if (ejercicios.length > 0) mostrarEjercicio(ejercicioActual);

// ----------------------------------------------------------------------
// PUNTAJE TOTAL
// ----------------------------------------------------------------------
async function actualizarPuntajeTotal() {
  obtenerPuntajeDesdeServidor();
}

// ----------------------------------------------------------------------
// ENVIAR RESULTADO (EJERCICIOS SIMPLES)
// ----------------------------------------------------------------------
async function guardarYEnviar(numEjercicio) {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) return alert("Debes iniciar sesión.");

  const input = document.querySelector(`#ejercicio${numEjercicio} input`);
  const valor = input.value || "0";

  try {
    const response = await fetch("https://backend-fluidos-production.up.railway.app/guardar_resultado/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario,
        ejercicio: numEjercicio,
        respuesta: valor,
      }),
    });

    const resultado = await response.json();
    console.log("📡 Servidor respondió:", resultado);

    const { color, puntaje } = resultado;

    // Actualizar visualmente
    const display = document.getElementById(`puntajeDisplay${numEjercicio}`);
    if (display) display.textContent = `Puntaje: ${puntaje}`;

    const semaforo = document.querySelector(`#semaforo${numEjercicio}`);
    if (semaforo) {
      semaforo.querySelectorAll(".luz").forEach(l => l.classList.remove("on"));
      semaforo.querySelector(`.${color}`).classList.add("on");
    }

    alert(
      color === "green"
        ? "✅ ¡Correcto!"
        : color === "yellow"
        ? "🟡 Casi correcto"
        : "❌ Incorrecto"
    );

    actualizarPuntajeTotal();
  } catch (error) {
    console.error("❌ Error al enviar resultado:", error);
    alert("Error al conectar con el servidor.");
  }
}

// ----------------------------------------------------------------------
// ENVIAR EJERCICIO MÚLTIPLE
// ----------------------------------------------------------------------
async function guardarYEnviarMultiples(numEjercicio) {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) return alert("Debes iniciar sesión.");

  const respuestas = obtenerRespuestasMultiples(numEjercicio);

  try {
    const response = await fetch("https://backend-fluidos-production.up.railway.app/guardar_resultado/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario,
        ejercicio: numEjercicio,
        respuesta: JSON.stringify(respuestas),
      }),
    });

    const resultado = await response.json();

    const { color, puntaje } = resultado;

    const display = document.getElementById(`puntajeDisplay${numEjercicio}`);
    if (display) display.textContent = `Puntaje: ${puntaje}`;

    const semaforo = document.querySelector(`#semaforo${numEjercicio}`);
    if (semaforo) {
      semaforo.querySelectorAll(".luz").forEach(l => l.classList.remove("on"));
      semaforo.querySelector(`.${color}`).classList.add("on");
    }

    alert(
      color === "green"
        ? "✅ ¡Correcto!"
        : color === "yellow"
        ? "🟡 Casi correcto"
        : "❌ Incorrecto"
    );

    actualizarPuntajeTotal();
  } catch (error) {
    alert("Error al conectar con el servidor.");
  }
}

// ----------------------------------------------------------------------
// OBTENER RESPUESTAS
// ----------------------------------------------------------------------
function obtenerRespuestasMultiples(numEjercicio) {
  return {
    a: {
      valor: document.getElementById(`respuesta${numEjercicio}a`).value,
      unidad: document.getElementById(`unidad${numEjercicio}a`).value,
    },
    b: {
      valor: document.getElementById(`respuesta${numEjercicio}b`).value,
      unidad: document.getElementById(`unidad${numEjercicio}b`).value,
    },
    c: {
      valor: document.getElementById(`respuesta${numEjercicio}c`).value,
      unidad: document.getElementById(`unidad${numEjercicio}c`).value,
    },
    d: {
      valor: document.getElementById(`respuesta${numEjercicio}d`).value,
      unidad: document.getElementById(`unidad${numEjercicio}d`).value,
    },
  };
}

// --------------------------------------------------------------
// PUNTAJE TOTAL DESDE EL SERVIDOR
// --------------------------------------------------------------
async function obtenerPuntajeDesdeServidor() {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) return;

  try {
    const res = await fetch(`https://backend-fluidos-production.up.railway.app/puntaje_total/${usuario}`);
    const data = await res.json();

    const totalDisplay = document.getElementById("puntajeUsuarioDisplay");
    if (totalDisplay) {
      totalDisplay.textContent = `Puntaje total: ${data.puntaje_total}`;
    }
  } catch (error) {
    console.error("❌ Error al obtener puntaje:", error);
  }
}

window.addEventListener("load", obtenerPuntajeDesdeServidor);