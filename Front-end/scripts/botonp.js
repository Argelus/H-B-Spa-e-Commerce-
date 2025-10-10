// Script para el botón flotante de FAQ

document.addEventListener('DOMContentLoaded', function() {
    const faqButton = document.getElementById('faq-button');
    const faqModal = document.getElementById('faq-modal');
    const closeButton = document.getElementById('close-faq');

    // Abrir modal al hacer clic en el botón flotante
    faqButton.addEventListener('click', function() {
        faqModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll del body
    });

    // Cerrar modal al hacer clic en el botón X
    closeButton.addEventListener('click', function() {
        faqModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
    });

    // Cerrar modal al hacer clic fuera del contenido
    faqModal.addEventListener('click', function(e) {
        if (e.target === faqModal) {
            faqModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && faqModal.classList.contains('active')) {
            faqModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});