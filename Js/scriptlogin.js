// Login interactivo simple
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitButton = form.querySelector('.login-btn');
    const successMessage = document.getElementById('successMessage');
    const socialButtons = document.querySelectorAll('.social-btn');

    // Toggle contraseña
    passwordToggle.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.querySelector('.toggle-text').textContent = 'HIDE';
        } else {
            passwordInput.type = 'password';
            passwordToggle.querySelector('.toggle-text').textContent = 'SHOW';
        }
    });

    // Social buttons simulados
    socialButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Login con ${btn.querySelector('.social-text').textContent} no implementado`);
        });
    });

    // Submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Animación de carga
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // Simular procesamiento
        setTimeout(() => {
            form.style.display = 'none';
            document.querySelector('.social-login').style.display = 'none';
            document.querySelector('.signup-link').style.display = 'none';

            successMessage.style.display = 'block';

            // Redirigir después de 1.5s
            setTimeout(() => {
                window.location.href = '/Front/HTML/index.html';
            }, 1500);
        }, 1000);
    });
});