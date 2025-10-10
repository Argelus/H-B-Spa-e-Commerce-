// ============================================
// VALIDACIÓN DEL FORMULARIO DE CONTACTO
// ============================================

// Espera a que el DOM cargue antes de conectar los eventos
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    // Agrega clase visual de validación al formulario cuando se intenta enviar
    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault(); // Evita envío si hay errores
            event.stopPropagation();
            console.log("❌ Validación fallida: faltan datos o hay errores en el formulario.");
        } else {
            console.log("✅ Formulario validado correctamente.");
        }

        // Bootstrap usa esta clase para mostrar estilos visuales
        form.classList.add('was-validated');
    }, false);
});


// ============================================
// FUNCIÓN GLOBAL DE VALIDACIÓN
// ============================================
// Se declara fuera del DOMContentLoaded para poder ser usada desde otros scripts (como el fetch del backend)
function validateForm() {
    let isFormValid = true;

    // === Validación del nombre ===
    // === Validación del nombre ===
const nameInput = document.getElementById('name');
const namePattern = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s]+$/; // Solo letras y espacios
const nameFeedback = document.getElementById('nameFeedback');

// 🔹 Siempre limpiamos ambas clases antes de comenzar
nameInput.classList.remove('is-valid', 'is-invalid');

if (nameInput.value.trim() === '') {
    nameInput.classList.add('is-invalid');
    if (nameFeedback) nameFeedback.textContent = 'El nombre es obligatorio.';
    isFormValid = false;
} else if (!namePattern.test(nameInput.value.trim())) {
    nameInput.classList.add('is-invalid');
    if (nameFeedback) nameFeedback.textContent = 'El nombre solo puede contener letras y espacios.';
    isFormValid = false;
} else {
    nameInput.classList.add('is-valid');
}


    // === Validación del correo electrónico ===
    const emailInput = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailFeedback = document.getElementById('emailFeedback');

    if (emailInput.value.trim() === '') {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        if (emailFeedback) emailFeedback.textContent = 'El correo electrónico es obligatorio.';
        isFormValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        if (emailFeedback) emailFeedback.textContent = 'Introduce un formato de correo válido (ejemplo@dominio.com).';
        isFormValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    // === Validación del asunto ===
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect.value === '' || subjectSelect.value === null) {
        subjectSelect.classList.remove('is-valid');
        subjectSelect.classList.add('is-invalid');
        isFormValid = false;
    } else {
        subjectSelect.classList.remove('is-invalid');
        subjectSelect.classList.add('is-valid');
    }

    // === Validación del mensaje ===
    const messageTextarea = document.getElementById('message');
    const messageFeedback = document.getElementById('messageFeedback');
    const minLength = 10;

    if (messageTextarea.value.trim() === '') {
        messageTextarea.classList.remove('is-valid');
        messageTextarea.classList.add('is-invalid');
        if (messageFeedback) messageFeedback.textContent = 'El mensaje es obligatorio.';
        isFormValid = false;
    } else if (messageTextarea.value.trim().length < minLength) {
        messageTextarea.classList.remove('is-valid');
        messageTextarea.classList.add('is-invalid');
        if (messageFeedback) messageFeedback.textContent = `El mensaje debe tener al menos ${minLength} caracteres.`;
        isFormValid = false;
    } else {
        messageTextarea.classList.remove('is-invalid');
        messageTextarea.classList.add('is-valid');
    }

    // === Teléfono (opcional, pero validamos si existe contenido) ===
    const phoneInput = document.getElementById('phone');
    if (phoneInput.value.trim() !== '') {
        const phonePattern = /^[0-9\s+\-()]+$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            phoneInput.classList.remove('is-valid');
            phoneInput.classList.add('is-invalid');
            isFormValid = false;
        } else {
            phoneInput.classList.remove('is-invalid');
            phoneInput.classList.add('is-valid');
        }
    } else {
        // Si está vacío, no marcar error (es opcional)
        phoneInput.classList.remove('is-invalid');
        phoneInput.classList.remove('is-valid');
    }

    // Devuelve true si todo es válido
    return isFormValid;
}
