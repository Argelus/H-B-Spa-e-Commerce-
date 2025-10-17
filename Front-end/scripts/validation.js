// ============================================
// VALIDACIÓN DEL FORMULARIO DE CONTACTO
// ============================================

// Espera a que el DOM cargue antes de conectar los eventos.
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Agrega la clase de validación de Bootstrap al intentar enviar el formulario.
    form.addEventListener('submit', function(event) {
        // Previene el envío si la validación falla.
        if (!validateForm()) {
            event.preventDefault();
            event.stopPropagation();
            console.log("❌ Validación fallida: faltan datos o hay errores en el formulario.");
        } else {
            console.log("✅ Formulario validado correctamente.");
        }
        form.classList.add('was-validated');
    }, false);
});

// ============================================
// FUNCIÓN GLOBAL DE VALIDACIÓN
// ============================================
// Se declara fuera de DOMContentLoaded para que pueda ser llamada desde otros scripts.
function validateForm() {
    let isFormValid = true;

    // Función auxiliar para validar un campo individual.
    const validateField = (input, feedbackElement, validationFn, requiredMsg, invalidMsg) => {
        input.classList.remove('is-valid', 'is-invalid');
        const value = input.value.trim();

        if (value === '') {
            input.classList.add('is-invalid');
            if (feedbackElement) feedbackElement.textContent = requiredMsg;
            return false;
        } else if (!validationFn(value)) {
            input.classList.add('is-invalid');
            if (feedbackElement) feedbackElement.textContent = invalidMsg;
            return false;
        } else {
            input.classList.add('is-valid');
            return true;
        }
    };

    // === Validación del nombre ===
    const nameInput = document.getElementById('name');
    const nameFeedback = document.getElementById('nameFeedback');
    const namePattern = /^[A-Za-zÑñáéíóúÁÉÍÓÚ\s]+$/;
    if (!validateField(nameInput, nameFeedback, (v) => namePattern.test(v), 'El nombre es obligatorio.', 'El nombre solo puede contener letras y espacios.')) {
        isFormValid = false;
    }

    // === Validación del correo electrónico ===
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('emailFeedback');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateField(emailInput, emailFeedback, (v) => emailPattern.test(v), 'El correo electrónico es obligatorio.', 'Introduce un formato de correo válido (ejemplo@dominio.com).')) {
        isFormValid = false;
    }

    // === Validación del asunto ===
    const subjectSelect = document.getElementById('subject');
    subjectSelect.classList.remove('is-valid', 'is-invalid');
    if (subjectSelect.value === '' || subjectSelect.value === null) {
        subjectSelect.classList.add('is-invalid');
        isFormValid = false;
    } else {
        subjectSelect.classList.add('is-valid');
    }

    // === Validación del mensaje ===
    const messageTextarea = document.getElementById('message');
    const messageFeedback = document.getElementById('messageFeedback');
    const minLength = 10;
    if (!validateField(messageTextarea, messageFeedback, (v) => v.length >= minLength, 'El mensaje es obligatorio.', `El mensaje debe tener al menos ${minLength} caracteres.`)) {
        isFormValid = false;
    }

    // === Teléfono (opcional, pero se valida si tiene contenido) ===
    const phoneInput = document.getElementById('phone');
    const phoneFeedback = document.getElementById('phoneFeedback');
    phoneInput.classList.remove('is-valid', 'is-invalid');
    if (phoneInput.value.trim() !== '') {
        const phonePattern = /^[0-9\s+\-()]+$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            phoneInput.classList.add('is-invalid');
            if (phoneFeedback) phoneFeedback.textContent = 'Introduce un número de teléfono válido.';
            isFormValid = false;
        } else {
            phoneInput.classList.add('is-valid');
        }
    }

    return isFormValid;
}
