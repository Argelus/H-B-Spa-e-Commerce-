// Navbar transparency behavior on scroll and collapse
// Modes:
// - auto (default): with hero -> transparent at top (dark), becomes solid on scroll/collapse; without hero -> always solid
// - transparent: transparent at top even without hero; becomes solid on scroll/collapse
// - solid: always solid

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const collapse = document.getElementById('navbarNav');
  if (!navbar) return;

  const hasHero = !!(document.body.classList.contains('has-hero') || document.getElementById('hero-carousel'));
  const mode = navbar.dataset.navbarMode || document.body.dataset.navbarMode || 'auto';
  const theme = (navbar.dataset.navbarTheme || 'auto').toLowerCase(); // 'dark' | 'light' | 'auto'

  const setTransparent = () => {
    navbar.classList.add('navbar-transparent');
    navbar.classList.remove('navbar-scrolled');
    // choose text scheme depending on background context
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
    const isExpanded = !!(collapse && collapse.classList.contains('show'));

    switch ((mode || 'auto').toLowerCase()) {
      case 'solid':
        setSolid();
        break;
      case 'transparent':
        if (scrolled || isExpanded) setSolid(); else setTransparent();
        break;
      case 'auto':
      default:
        if (hasHero) {
          if (scrolled || isExpanded) setSolid(); else setTransparent();
        } else {
          setSolid();
        }
        break;
    }
  };

  // Initialize on load
  onScroll();

  // Scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Collapse open/close listeners (Bootstrap events)
  if (collapse) {
    collapse.addEventListener('show.bs.collapse', onScroll);
    collapse.addEventListener('hide.bs.collapse', onScroll);
    // Also handle when the transition finishes so the class `show` is present/removed
    collapse.addEventListener('shown.bs.collapse', onScroll);
    collapse.addEventListener('hidden.bs.collapse', onScroll);
  }

  // --- Ensure FAQ + Cart bubbles are stacked bottom-right ---
  function ensureBubbleStacking() {
    try {
      const faqBtn = document.getElementById('faq-button');
      const cart = document.getElementById('cart-preview');
      const gap = 8; // px gap between bubbles
      const baseRight = 16; // px from right edge
      const baseBottom = 16; // px from bottom for faq

      if (faqBtn) {
        faqBtn.style.setProperty('position', 'fixed', 'important');
        faqBtn.style.setProperty('right', baseRight + 'px', 'important');
        faqBtn.style.setProperty('bottom', baseBottom + 'px', 'important');
        faqBtn.style.setProperty('z-index', '900', 'important');
        // ensure size consistent
        faqBtn.style.setProperty('width', '56px');
        faqBtn.style.setProperty('height', '56px');
      }

      if (cart) {
        // compute bottom offset so cart sits above faqBtn
        let faqHeight = 56; // fallback
        if (faqBtn) {
          const r = faqBtn.getBoundingClientRect();
          faqHeight = Math.round(r.height) || faqHeight;
        }
        const cartBottom = baseBottom + faqHeight + gap; // px from bottom
        cart.style.setProperty('position', 'fixed', 'important');
        cart.style.setProperty('right', baseRight + 'px', 'important');
        cart.style.setProperty('bottom', cartBottom + 'px', 'important');
        cart.style.setProperty('z-index', '1001', 'important');
        cart.style.setProperty('width', '56px');
        cart.style.setProperty('height', '56px');
      }
    } catch (e) {
      // ignore
      // console.warn('ensureBubbleStacking error', e);
    }
  }

  // Run on load + a few delayed attempts to catch async-inserted nodes
  window.addEventListener('load', ensureBubbleStacking);
  ensureBubbleStacking();
  setTimeout(ensureBubbleStacking, 300);
  setTimeout(ensureBubbleStacking, 1000);

  // Reposition on resize/scroll
  window.addEventListener('resize', ensureBubbleStacking);
  window.addEventListener('scroll', ensureBubbleStacking, true);

  // MutationObserver to pick up elements inserted later (eg. cart-preview created by other script)
  const mo = new MutationObserver((mutations) => {
    ensureBubbleStacking();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // --- Ensure FAQ UI (button + modal) exists and FAQ content is loaded consistently ---
  function computeFaqUrl(){
    try {
      const path = (window.location && window.location.pathname) || '';
      if (path.includes('/pages/')) return 'faq.html'; // from inside /pages
      return 'pages/faq.html'; // from root
    } catch {
      return 'pages/faq.html';
    }
  }

  async function ensureFaqContent(){
    const container = document.getElementById('faq-container');
    if (!container) return;
    if (container.dataset.loaded === '1' || container.childElementCount > 0) return; // already loaded
    try {
      const url = computeFaqUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP '+res.status);
      const html = await res.text();
      container.innerHTML = html;
      container.dataset.loaded = '1';
      // Initialize collapses if Bootstrap is present
      if (window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
        const collapses = container.querySelectorAll('.accordion-collapse');
        collapses.forEach(c => { try { new window.bootstrap.Collapse(c, { toggle: false }); } catch(e){} });
      } else {
        // Retry after a tick if bootstrap is not yet ready
        setTimeout(() => {
          if (window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
            const collapses = container.querySelectorAll('.accordion-collapse');
            collapses.forEach(c => { try { new window.bootstrap.Collapse(c, { toggle: false }); } catch(e){} });
          }
        }, 300);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error al cargar FAQ:', e);
    }
  }

  function ensureFaqUi(){
    // Ensure button
    let btn = document.getElementById('faq-button');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'faq-button';
      btn.className = 'faq-floating-btn';
      btn.setAttribute('aria-label','Preguntas Frecuentes');
      btn.innerHTML = '<i class="bi bi-question-circle-fill"></i>';
      document.body.appendChild(btn);
    }
    // Ensure modal
    let modal = document.getElementById('faq-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'faq-modal';
      modal.className = 'faq-modal';
      modal.innerHTML = `
        <div class="faq-modal-content">
          <div class="faq-modal-header">
            <h3 class="mb-0">Preguntas Frecuentes</h3>
            <button id="close-faq" class="faq-close-btn" aria-label="Cerrar">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="faq-modal-body">
            <div class="accordion" id="faqAccordion">
              <div id="faq-container"></div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }
    // Load content if needed
    ensureFaqContent();
  }

  // Run FAQ ensure on load/dom ready and when DOM mutates
  document.addEventListener('DOMContentLoaded', ensureFaqUi);
  window.addEventListener('load', ensureFaqUi);

  const moFaq = new MutationObserver(() => ensureFaqUi());
  moFaq.observe(document.body, { childList: true, subtree: true });

});
