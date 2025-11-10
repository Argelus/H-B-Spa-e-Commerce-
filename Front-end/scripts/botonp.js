// Script para el botón flotante de FAQ

(function(){
  function bindFaqHandlers() {
    const faqButton = document.getElementById('faq-button');
    const faqModal = document.getElementById('faq-modal');
    const closeButton = document.getElementById('close-faq');

    if (!faqButton || !faqModal) return false;

    if (faqButton.dataset.faqBound) return true;

    function applyModalFallbackStyles() {
      try {
        faqModal.style.display = 'flex';
        faqModal.style.position = 'fixed';
        faqModal.style.left = '0';
        faqModal.style.top = '0';
        faqModal.style.width = '100%';
        faqModal.style.height = '100%';
        faqModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        faqModal.style.alignItems = 'center';
        faqModal.style.justifyContent = 'center';
        faqModal.style.zIndex = '1005';

        const content = faqModal.querySelector('.faq-modal-content');
        if (content) {
          content.style.backgroundColor = 'var(--arena-suave)';
          content.style.borderRadius = '12px';
          content.style.width = '90%';
          content.style.maxWidth = '600px';
          content.style.maxHeight = '80vh';
          content.style.overflowY = 'auto';
          content.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
        }
      } catch (e) {
        // ignore
      }
    }

    function clearModalFallbackStyles() {
      try {
        faqModal.style.display = '';
        faqModal.style.position = '';
        faqModal.style.left = '';
        faqModal.style.top = '';
        faqModal.style.width = '';
        faqModal.style.height = '';
        faqModal.style.backgroundColor = '';
        faqModal.style.alignItems = '';
        faqModal.style.justifyContent = '';
        faqModal.style.zIndex = '';

        const content = faqModal.querySelector('.faq-modal-content');
        if (content) {
          content.style.backgroundColor = '';
          content.style.borderRadius = '';
          content.style.width = '';
          content.style.maxWidth = '';
          content.style.maxHeight = '';
          content.style.overflowY = '';
          content.style.boxShadow = '';
        }
      } catch (e) { /* ignore */ }
    }

    function openFaq() {
      const container = faqModal.querySelector('#faq-container');
      faqModal.classList.add('active');
      applyModalFallbackStyles();
      document.body.style.overflow = 'hidden';
      const firstFocusable = faqModal.querySelector('button, a, [href], input, textarea, select');
      if (firstFocusable) firstFocusable.focus();
    }
    function closeFaq() {
      faqModal.classList.remove('active');
      clearModalFallbackStyles();
      document.body.style.overflow = '';
      faqButton.focus();
    }

    faqButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if (faqModal.classList.contains('active')) closeFaq(); else openFaq();
    });

    if (closeButton) {
      closeButton.addEventListener('click', function(e){
        e.preventDefault();
        closeFaq();
      });
    }

    // Cerrar modal al hacer clic fuera del contenido
    faqModal.addEventListener('click', function(e) {
      if (e.target === faqModal) {
        closeFaq();
      }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && faqModal.classList.contains('active')) {
        closeFaq();
      }
    });

    faqButton.dataset.faqBound = '1';
    return true;
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (bindFaqHandlers()) return;
    const mo = new MutationObserver((mutations, obs) => {
      if (bindFaqHandlers()) {
        obs.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 5000);
  });
})();
