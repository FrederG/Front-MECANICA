// Función para cargar resultados desde el servidor
async function cargarResultados() {
    try {
        const response = await fetch("https://backend-fluidos-production.up.railway.app/resultados_db/");
        const data = await response.json();

        const tbody = document.querySelector("#tablaResultados tbody");
        tbody.innerHTML = ""; // Limpia antes de insertar

        if (data.resultados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No hay resultados registrados</td></tr>';
            return;
        }

        data.resultados.forEach(r => {
            const row = document.createElement("tr");
            
            // Formatear la respuesta para que sea más legible
            let respuestaFormateada = r.respuesta;
            
            // Si es el ejercicio 6 o 10 (múltiples respuestas), intentar formatear como JSON
            if (r.ejercicio === 6 || r.ejercicio === 10) {
                try {
                    const respuestasMultiples = JSON.parse(r.respuesta);
                    respuestaFormateada = Object.entries(respuestasMultiples)
                        .map(([key, value]) => 
                            `${key.toUpperCase()}: ${value.valor} ${value.unidad || ''}`
                        )
                        .join('<br>');
                } catch (e) {
                    // Si no es JSON válido, mostrar como texto normal
                    respuestaFormateada = r.respuesta;
                }
            }

            row.innerHTML = `
                <td>${r.usuario}</td>
                <td>${r.ejercicio}</td>
                <td class="respuesta-cell">${respuestaFormateada}</td>
                <td>${r.puntaje}</td>
                <td class="estado-cell">
                    <span class="estado-indicador" style="background-color:${r.color === 'green' ? '#2ecc71' : r.color === 'yellow' ? '#f39c12' : '#e74c3c'}"></span>
                    ${r.color === 'green' ? '✅ Correcto' : r.color === 'yellow' ? '🟡 Parcial' : '❌ Incorrecto'}
                </td>
                <td>${new Date(r.fecha).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Error al cargar los resultados:", error);
        const tbody = document.querySelector("#tablaResultados tbody");
        tbody.innerHTML = '<tr><td colspan="6">❌ Error al cargar los resultados desde el servidor</td></tr>';
    }
}

// Función para eliminar un resultado específico
async function eliminarResultado(id) {
    if (!confirm("¿Seguro que deseas eliminar este resultado?")) return;

    try {
        const response = await fetch(`https://backend-fluidos-production.up.railway.app/eliminar_resultado/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        alert(data.mensaje);
        cargarResultados(); // recarga la tabla
    } catch (error) {
        console.error("❌ Error al eliminar resultado:", error);
        alert("Error al eliminar el resultado");
    }
}

// Función para eliminar todos los resultados
async function eliminarTodos() {
    if (!confirm("⚠️ Esto borrará todos los resultados del servidor. ¿Estás seguro?")) return;

    try {
        const response = await fetch("https://backend-fluidos-production.up.railway.app/eliminar_todos/", {
            method: "DELETE"
        });

        const data = await response.json();
        alert(data.mensaje);
        cargarResultados(); // recarga la tabla
    } catch (error) {
        console.error("❌ Error al eliminar todos los resultados:", error);
        alert("Error al eliminar los resultados");
    }
}

// Función para mostrar el puntaje total del usuario logueado
async function mostrarPuntajeUsuario() {
    const usuario = localStorage.getItem("usuarioActivo");
    const display = document.getElementById("puntajeUsuarioDisplay");
    
    if (!usuario) {
        display.textContent = "⚠️ No hay usuario activo. Inicia sesión para ver tu puntaje.";
        display.className = "puntaje-total-display error";
        return;
    }

    try {
        const res = await fetch(`https://backend-fluidos-production.up.railway.app/puntaje_total/${usuario}`);
        const data = await res.json();

        display.textContent = `🎯 Puntaje total de ${data.usuario}: ${data.puntaje_total} puntos`;
        display.className = "puntaje-total-display exito";
    } catch (error) {
        console.error("❌ Error al obtener puntaje:", error);
        display.textContent = "❌ Error al conectar con el servidor";
        display.className = "puntaje-total-display error";
    }
}

// Cargar resultados cuando se carga la página
document.addEventListener("DOMContentLoaded", function() {
    cargarResultados();
    mostrarPuntajeUsuario();
});

// También cargar al hacer load por si acaso
window.addEventListener("load", function() {
    cargarResultados();
    mostrarPuntajeUsuario();
});