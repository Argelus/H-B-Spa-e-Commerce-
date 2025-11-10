<<<<<<< HEAD
=======

>>>>>>> f208f194d747f2834788bebe7cd738162a433b95

(function() {
  'use strict';
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

<<<<<<< HEAD
=======

>>>>>>> f208f194d747f2834788bebe7cd738162a433b95
  function initModals() {
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

      window.closeFaqModalFunc = closeFaqModalFunc;
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (window.closeFaqModalFunc) window.closeFaqModalFunc();
       
      }
    });
  }

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

