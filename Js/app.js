let lastScroll = 0;
const header = document.querySelector("header");

// --- Ocultar header al hacer scroll ---
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.top = "-100px";
  } else {
    header.style.top = "0";
  }
  lastScroll = currentScroll;
});

// --- Cerrar sesión ---
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo"); // solo elimina usuario, NO resultados
  alert("👋 Sesión cerrada correctamente");
  window.location.href = "login.html";
}
