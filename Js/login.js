console.log("✅ login cargado correctamente");

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("loginMensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  try {
    const response = await fetch("https://backend-fluidos-production.up.railway.app/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasena }),
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.style.color = "limegreen";
      mensaje.textContent = data.mensaje;

      // ✅ Guardar usuario en localStorage
      localStorage.setItem("usuarioActivo", usuario);

      // Redirigir a ejercicios
      setTimeout(() => {
        window.location.href = "ejercicios.html";
      }, 1000);
    } else {
      mensaje.style.color = "red";
      mensaje.textContent = data.detail || "Error al iniciar sesión.";
    }

  } catch (error) {
    mensaje.style.color = "red";
    mensaje.textContent = "Error de conexión con el servidor.";
    console.error("❌ Error:", error);
  }
});

document.querySelector(".btn-cerrar-sesion").addEventListener("click", () => {
  localStorage.removeItem("usuarioActivo"); // Borra el usuario guardado
  window.location.href = "login.html";      // Redirige al login
});