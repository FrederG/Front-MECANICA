let lastScroll = 0;  // almacena la posición anterior del scroll
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // si bajamos, escondemos el header
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.top = "-100px";  // muévelo fuera de la vista
  } 
  // si subimos, mostramos el header
  else {
    header.style.top = "0";
  } 

  lastScroll = currentScroll;
});

// Este código debe estar en tu archivo /js/app.js o /js/login.js
function cerrarSesion() {
    // 1. Opcional: Eliminar el estado de sesión (como el usuario guardado)
    localStorage.removeItem("usuarioActivo");

    // 2. Redirigir al archivo ../index.html
    window.location.href = "../index.html"; 
}