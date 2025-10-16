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
});
