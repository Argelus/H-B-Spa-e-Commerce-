document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const collapse = document.getElementById('navbarNav');
  if (!navbar) return;

  const hasHero = document.body.classList.contains('has-hero') || !!document.getElementById('hero-carousel');
  const mode = navbar.dataset.navbarMode || document.body.dataset.navbarMode || 'auto';
  const theme = (navbar.dataset.navbarTheme || 'auto').toLowerCase(); 

  const setTransparent = () => {
    navbar.classList.add('navbar-transparent');
    navbar.classList.remove('navbar-scrolled');
    const useDark = theme === 'dark' || (theme === 'auto' && hasHero);
    if (useDark) {
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    } else {
      navbar.classList.add('navbar-light');
      navbar.classList.remove('navbar-dark');
    }
  };
  const setSolid = () => {
    navbar.classList.add('navbar-scrolled', 'navbar-light');
    navbar.classList.remove('navbar-transparent', 'navbar-dark');
  };

  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    const isExpanded = collapse && collapse.classList.contains('show');

    switch ((mode || 'auto').toLowerCase()) {
      case 'solid':
        setSolid();
        break;
      case 'transparent':
        if (scrolled || isExpanded) setSolid();
        else setTransparent();
        break;
      case 'auto':
      default:
        if (hasHero) {
          if (scrolled || isExpanded) setSolid();
          else setTransparent();
        } else {
          setSolid();
        }
        break;
    }
  };

  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });

  if (collapse) {
    collapse.addEventListener('show.bs.collapse', onScroll);
    collapse.addEventListener('hide.bs.collapse', onScroll);
    collapse.addEventListener('shown.bs.collapse', onScroll);
    collapse.addEventListener('hidden.bs.collapse', onScroll);
  }

  function computeFaqUrl() {
    try {
      const path = window.location.pathname || '';
      if (path.includes('/pages/')) return 'faq.html';
      return 'pages/faq.html';
    } catch {
      return 'pages/faq.html'; 
    }
  }

  async function loadFaqContent() {
    const container = document.getElementById('faq-container');
    if (!container || container.dataset.loaded === 'true') return;

    try {
      const url = computeFaqUrl();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      container.innerHTML = await response.text();
      container.dataset.loaded = 'true';

      if (window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
        const collapses = container.querySelectorAll('.accordion-collapse');
        collapses.forEach(el => new window.bootstrap.Collapse(el, { toggle: false }));
      }
    } catch (error) {
      console.error('Error al cargar el contenido de FAQ:', error);
      container.innerHTML = '<p class="text-danger">No se pudieron cargar las preguntas frecuentes. Por favor, intente más tarde.</p>';
    }
  }

  function setupFaqInteraction() {
    const faqButton = document.getElementById('faq-button');
    const faqModal = document.getElementById('faq-modal');
    const closeButton = document.getElementById('close-faq');

    if (!faqButton || !faqModal || !closeButton || faqButton.dataset.faqHandled) return;

    const openFaq = () => {
      loadFaqContent(); 
      faqModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeButton.focus(); 
    };

    const closeFaq = () => {
      faqModal.classList.remove('active');
      document.body.style.overflow = '';
      faqButton.focus(); 
    };

    faqButton.addEventListener('click', openFaq);
    closeButton.addEventListener('click', closeFaq);

    faqModal.addEventListener('click', (e) => {
      if (e.target === faqModal) closeFaq();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && faqModal.classList.contains('active')) {
        closeFaq();
      }
    });

    faqButton.dataset.faqHandled = 'true';
  }

  setupFaqInteraction();
  const observer = new MutationObserver(() => {
    setupFaqInteraction();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
