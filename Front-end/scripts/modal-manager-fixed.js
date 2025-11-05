/**
 * Modal Manager - Sistema centralizado para manejo de modals
 * Evita duplicación de código y facilita mantenimiento
 */

(function() {
  'use strict';

  // Navbar scroll
  function initNavbarScroll() {
    window.addEventListener("scroll", function() {
      const navbar = document.querySelector(".navbar-overlay");
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    });
  }

  // Inicializar modals
  function initModals() {
    // FAQ Modal
    const faqModal = document.getElementById('faqModal');
    const floatingFaqBtn = document.getElementById('floatingFaqBtn');
    const openFaqBtnMobile = document.getElementById('openFaqBtnMobile');
    const closeFaqModal = document.getElementById('closeFaqModal');

    if (faqModal) {
      function openFaqModal() {
        faqModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeFaqModalFunc() {
        faqModal.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (floatingFaqBtn) {
        floatingFaqBtn.addEventListener('click', function(e) {
          e.preventDefault();
          openFaqModal();
        });
      }

      if (openFaqBtnMobile) {
        openFaqBtnMobile.addEventListener('click', function(e) {
          e.preventDefault();
          openFaqModal();
        });
      }

      if (closeFaqModal) {
        closeFaqModal.addEventListener('click', closeFaqModalFunc);
      }

      faqModal.addEventListener('click', function(e) {
        if (e.target === faqModal) {
          closeFaqModalFunc();
        }
      });

      // Guardar para usar con ESC
      window.closeFaqModalFunc = closeFaqModalFunc;
    }

    // ESC key para cerrar todos los modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (window.closeFaqModalFunc) window.closeFaqModalFunc();
        //if (window.closeCartModalFunc) window.closeCartModalFunc();
      }
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initNavbarScroll();
      initModals();
    });
  } else {
    initNavbarScroll();
    initModals();
  }
})();

