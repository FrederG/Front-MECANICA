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

function cerrarSesion() {
  localStorage.clear(); // Limpia todo (usuario, resultados, etc.)
  alert("👋 Sesión cerrada correctamente");
  window.location.href = "login.html"; // Redirige a tu página de login
}
