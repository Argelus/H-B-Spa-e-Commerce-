document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();
            event.stopPropagation(); //Evita que el evento actual (el submit) ascienda o se propague a los elementos padre del formulario en la estructura del DOM.
        }

        form.classList.add('was-validated');
    }, false);


    function validateForm() {
        let isFormValid = true;
        const nameInput = document.getElementById('name');
        if (nameInput.value.trim() === '') {
            nameInput.classList.remove('is-valid');
            nameInput.classList.add('is-invalid');
            isFormValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
            nameInput.classList.add('is-valid');
        }

        const emailInput = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
            const feedback = document.getElementById('emailFeedback');
            if (emailInput.value.trim() === '') {
                 feedback.textContent = 'El correo electrónico es obligatorio.';
            } else {
                 feedback.textContent = 'Introduce un formato de correo electrónico válido (ej: usuario@dominio.com).';
            }
            isFormValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }

        const subjectSelect = document.getElementById('subject');
        if (subjectSelect.value === '' || subjectSelect.value === null) {
            subjectSelect.classList.remove('is-valid');
            subjectSelect.classList.add('is-invalid');
            isFormValid = false;
        } else {
            subjectSelect.classList.remove('is-invalid');
            subjectSelect.classList.add('is-valid');
        }

        const messageTextarea = document.getElementById('message');
        const minLength = 10;
        
        if (messageTextarea.value.trim().length < minLength) {
            messageTextarea.classList.remove('is-valid');
            messageTextarea.classList.add('is-invalid');
            const feedback = document.getElementById('messageFeedback');
            if (messageTextarea.value.trim() === '') {
                feedback.textContent = 'El mensaje es obligatorio.';
            } else {
                feedback.textContent = `El mensaje debe tener al menos ${minLength} caracteres.`;
            }
            isFormValid = false;
        } else {
            messageTextarea.classList.remove('is-invalid');
            messageTextarea.classList.add('is-valid');
        }
        return isFormValid;
    }

});