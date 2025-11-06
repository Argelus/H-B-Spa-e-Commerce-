// Script para el botón flotante de FAQ

(function(){
  function bindFaqHandlers() {
    const faqButton = document.getElementById('faq-button');
    const faqModal = document.getElementById('faq-modal');
    const closeButton = document.getElementById('close-faq');

    if (!faqButton || !faqModal) return false;

    // guard to avoid duplicate bindings
    if (faqButton.dataset.faqBound) return true;

    function applyModalFallbackStyles() {
      // Apply minimal overlay styles if the CSS is missing or overridden
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
        // remove only the inline styles we set
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
      // First ensure content exists (fetch might load it asynchronously)
      const container = faqModal.querySelector('#faq-container');
      // apply fallback display so user sees overlay even if content pending
      faqModal.classList.add('active');
      applyModalFallbackStyles();
      document.body.style.overflow = 'hidden';
      // move focus into modal for accessibility
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
    // If elements not present yet, observe DOM until they appear
    const mo = new MutationObserver((mutations, obs) => {
      if (bindFaqHandlers()) {
        obs.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // safety timeout to disconnect after a while
    setTimeout(() => mo.disconnect(), 5000);
  });
})();
