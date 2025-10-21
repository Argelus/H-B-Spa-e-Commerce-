// Gestión del comportamiento de la barra de navegación al hacer scroll y colapsar.
// Modos de funcionamiento:
// - auto (por defecto): Con un 'hero' section, la barra es transparente al inicio (oscura) y se vuelve sólida al hacer scroll o colapsar. Sin 'hero', siempre es sólida.
// - transparent: La barra es transparente al inicio incluso sin 'hero', y se vuelve sólida al hacer scroll o colapsar.
// - solid: La barra siempre es sólida.

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const collapse = document.getElementById('navbarNav');
  if (!navbar) return;

  const hasHero = document.body.classList.contains('has-hero') || !!document.getElementById('hero-carousel');
  const mode = navbar.dataset.navbarMode || document.body.dataset.navbarMode || 'auto';
  const theme = (navbar.dataset.navbarTheme || 'auto').toLowerCase(); // 'dark' | 'light' | 'auto'

  const setTransparent = () => {
    navbar.classList.add('navbar-transparent');
    navbar.classList.remove('navbar-scrolled');
    // Elige el esquema de color del texto según el contexto del fondo.
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

  // Inicializar al cargar la página.
  onScroll();

  // Añadir event listener para el scroll.
  window.addEventListener('scroll', onScroll, { passive: true });

  // Añadir event listeners para el colapso del menú (eventos de Bootstrap).
  if (collapse) {
    collapse.addEventListener('show.bs.collapse', onScroll);
    collapse.addEventListener('hide.bs.collapse', onScroll);
    collapse.addEventListener('shown.bs.collapse', onScroll);
    collapse.addEventListener('hidden.bs.collapse', onScroll);
  }

  // --- Lógica para la interfaz de Preguntas Frecuentes (FAQ) ---

  // Determina la URL correcta para cargar el contenido de FAQ.
  function computeFaqUrl() {
    try {
      const path = window.location.pathname || '';
      // Si estamos dentro de /pages/, la ruta es relativa.
      if (path.includes('/pages/')) return 'faq.html';
      // Desde la raíz, la ruta es hacia /pages/.
      return 'pages/faq.html';
    } catch {
      return 'pages/faq.html'; // Fallback seguro.
    }
  }

  // Carga el contenido de FAQ de forma asíncrona.
  async function loadFaqContent() {
    const container = document.getElementById('faq-container');
    if (!container || container.dataset.loaded === 'true') return;

    try {
      const url = computeFaqUrl();
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      container.innerHTML = await response.text();
      container.dataset.loaded = 'true';

      // Inicializa los componentes de collapse de Bootstrap si están disponibles.
      if (window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
        const collapses = container.querySelectorAll('.accordion-collapse');
        collapses.forEach(el => new window.bootstrap.Collapse(el, { toggle: false }));
      }
    } catch (error) {
      console.error('Error al cargar el contenido de FAQ:', error);
      container.innerHTML = '<p class="text-danger">No se pudieron cargar las preguntas frecuentes. Por favor, intente más tarde.</p>';
    }
  }

  // Crea y gestiona la interfaz del modal de FAQ.
  function setupFaqInteraction() {
    const faqButton = document.getElementById('faq-button');
    const faqModal = document.getElementById('faq-modal');
    const closeButton = document.getElementById('close-faq');

    if (!faqButton || !faqModal || !closeButton || faqButton.dataset.faqHandled) return;

    const openFaq = () => {
      loadFaqContent(); // Carga el contenido solo cuando se abre por primera vez.
      faqModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeButton.focus(); // Mueve el foco al botón de cerrar para accesibilidad.
    };

    const closeFaq = () => {
      faqModal.classList.remove('active');
      document.body.style.overflow = '';
      faqButton.focus(); // Devuelve el foco al botón principal.
    };

    faqButton.addEventListener('click', openFaq);
    closeButton.addEventListener('click', closeFaq);

    // Cierra el modal al hacer clic fuera del contenido.
    faqModal.addEventListener('click', (e) => {
      if (e.target === faqModal) closeFaq();
    });

    // Cierra el modal con la tecla Escape.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && faqModal.classList.contains('active')) {
        closeFaq();
      }
    });

    faqButton.dataset.faqHandled = 'true';
  }

  // Ejecuta la configuración de FAQ cuando el DOM esté listo.
  setupFaqInteraction();
  // También observa si los elementos se añaden dinámicamente.
  const observer = new MutationObserver(() => {
    setupFaqInteraction();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
