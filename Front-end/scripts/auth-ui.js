// Archivo: ../scripts/auth-ui.js

document.addEventListener('DOMContentLoaded', () => {
    const loginGroups = document.querySelectorAll('[data-auth-group="login"]');
    const logoutGroups = document.querySelectorAll('[data-auth-group="logout"]');
    const logoutButtons = new Set(document.querySelectorAll('[data-logout-btn]'));
    const legacyLogoutBtn = document.getElementById('logout-btn');

    if (legacyLogoutBtn) {
        logoutButtons.add(legacyLogoutBtn);
    }

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token; 

    loginGroups.forEach(group => {
        group.classList.toggle('d-none', isLoggedIn);
    });

    logoutGroups.forEach(group => {
        group.classList.toggle('d-none', !isLoggedIn);
    });

    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');

            window.location.href = '/Front-end/index.html';
        });
    });
});