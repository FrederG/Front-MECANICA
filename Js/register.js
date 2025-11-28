document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    try {
      const response = await fetch("https://backend-fluidos-production.up.railway.app/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, email, contrasena })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      } else {
        alert("⚠️ " + data.detail);
      }

    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al conectar con el servidor.");
    }
  });
});