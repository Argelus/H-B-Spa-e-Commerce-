// Archivo: ../scripts/auth-ui.js

document.addEventListener('DOMContentLoaded', () => {
    const authGroup = document.getElementById('auth-group');
    const logoutGroup = document.getElementById('logout-group');
    const logoutBtn = document.getElementById('logout-btn');

    // ** Lógica de Verificación **: Revisa si existe el token guardado durante el login.
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token; // True si token existe, False si es null.

    // --- Control de Visibilidad ---
    if (authGroup && logoutGroup) {
        if (isLoggedIn) {
            // Usuario logueado: Ocultar Acceder/Registro, Mostrar Salir
            authGroup.classList.add('d-none');
            logoutGroup.classList.remove('d-none');
        } else {
            // Usuario NO logueado: Mostrar Acceder/Registro, Ocultar Salir
            authGroup.classList.remove('d-none');
            logoutGroup.classList.add('d-none');
        }
    }
    
    // --- Lógica del Botón Salir ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Limpia los datos de sesión de localStorage
            localStorage.removeItem('token'); 
            localStorage.removeItem('username'); 
            localStorage.removeItem('role'); 

            // Redirige al usuario al inicio para aplicar el cambio de navbar
            window.location.href = '../index.html'; 
        });
    }
});