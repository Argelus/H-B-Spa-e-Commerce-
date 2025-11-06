// Archivo: ../scripts/auth-ui.js

document.addEventListener('DOMContentLoaded', () => {
    const loginGroups = document.querySelectorAll('[data-auth-group="login"]');
    const logoutGroups = document.querySelectorAll('[data-auth-group="logout"]');
    const logoutButtons = new Set(document.querySelectorAll('[data-logout-btn]'));
    const legacyLogoutBtn = document.getElementById('logout-btn');

    if (legacyLogoutBtn) {
        logoutButtons.add(legacyLogoutBtn);
    }

    // ** Lógica de Verificación **: Revisa si existe el token guardado durante el login.
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token; // True si token existe, False si es null.

    // --- Control de Visibilidad ---
    loginGroups.forEach(group => {
        group.classList.toggle('d-none', isLoggedIn);
    });

    logoutGroups.forEach(group => {
        group.classList.toggle('d-none', !isLoggedIn);
    });

    // --- Lógica del Botón Salir ---
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Limpia los datos de sesión de localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');

            // Redirige al usuario al inicio para aplicar el cambio de navbar
            window.location.href = '../index.html';
        });
    });
});