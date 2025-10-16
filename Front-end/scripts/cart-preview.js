// Lightweight cart preview controller
// - Keeps a small cart count in localStorage to power the preview bar
// - Listens for `cart:updated` custom events to refresh the UI
// - Always shows the preview bar (replacing the navbar cart link site-wide)

(function(){
  const STORAGE_KEY = 'hbspa_cart';
  const PRODUCTS_KEY = 'hbspa_products';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: {}, updatedAt: 0 };
      const parsed = JSON.parse(raw);
      return { items: parsed.items || {}, updatedAt: parsed.updatedAt || 0 };
    } catch (e) {
      return { items: {}, updatedAt: 0 };
    }
  }

  function setCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart.items || {}, updatedAt: Date.now() }));
    } catch (e) { /* ignore */ }
  }

  function getCount(cart) {
    return Object.values(cart.items || {}).reduce((acc, n) => acc + (Number(n) || 0), 0);
  }

  function getProductsMap(){
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      if(!raw) return {};
      const parsed = JSON.parse(raw) || {};
      return parsed;
    } catch { return {}; }
  }

  function ensurePopover(){
    let pop = document.getElementById('cart-popover');
    if(pop) return pop;
    pop = document.createElement('div');
    pop.id = 'cart-popover';
    pop.className = 'cart-popover';
    pop.innerHTML = `
      <div class="cart-popover-header">
        <div class="title">Tu carrito</div>
        <button type="button" class="btn btn-sm btn-light" id="cart-popover-close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="cart-popover-body" id="cart-popover-body"></div>
      <div class="cart-popover-footer">
        <a class="btn btn-primary btn-cart" id="cart-popover-cta" href="#">Ver carrito</a>
      </div>
    `;
    document.body.appendChild(pop);
    // Close button
    pop.querySelector('#cart-popover-close').addEventListener('click', () => hidePopover());
    return pop;
  }

  function computeCartUrl(){
    try {
      const isInPages = /\/pages\//.test(location.pathname);
      return isInPages ? 'ShoppingCart.html' : 'pages/ShoppingCart.html';
    } catch { return 'pages/ShoppingCart.html'; }
  }

  function renderPopover(){
    const pop = ensurePopover();
    const body = pop.querySelector('#cart-popover-body');
    const cta = pop.querySelector('#cart-popover-cta');
    cta.setAttribute('href', computeCartUrl());

    const cart = getCart();
    const map = getProductsMap();

    const entries = Object.entries(cart.items || {});
    if(entries.length === 0){
      body.innerHTML = `<div class="cart-popover-empty">Tu carrito está vacío.</div>`;
      return;
    }

    // Render up to 6 items for compact preview
    const limit = 6;
    const parts = [];
    let shown = 0;
    for(const [id, qty] of entries){
      if(shown >= limit) break;
      const meta = map[String(id)] || {};
      const name = meta.name || `Producto #${id}`;
      const price = (typeof meta.price !== 'undefined') ? `$${meta.price}` : '';
      const img = meta.imageUrl || 'https://via.placeholder.com/112x112?text=%F0%9F%9B%92';
      parts.push(`
        <div class="cart-popover-item">
          <img src="${img}" alt="${name}">
          <div>
            <div class="name">${name}</div>
            <div class="meta">x${qty} ${price ? `• ${price}` : ''}</div>
          </div>
          <div class="fw-bold">x${qty}</div>
        </div>
      `);
      shown++;
    }
    if(entries.length > limit){
      const more = entries.length - limit;
      parts.push(`<div class="text-center text-muted small mb-2">+${more} más…</div>`);
    }

    body.innerHTML = parts.join('');
  }

  function showPopover(){
    const pop = ensurePopover();
    renderPopover();
    pop.classList.add('show');
    document.addEventListener('click', onDocumentClick, true);
  }
  function hidePopover(){
    const pop = document.getElementById('cart-popover');
    if(pop){ pop.classList.remove('show'); }
    document.removeEventListener('click', onDocumentClick, true);
  }
  function togglePopover(){
    const pop = ensurePopover();
    if(pop.classList.contains('show')) hidePopover(); else showPopover();
  }
  function onDocumentClick(e){
    const pop = document.getElementById('cart-popover');
    const bubble = document.getElementById('cart-preview');
    if(!pop) return;
    const target = e.target;
    if(pop.contains(target) || (bubble && bubble.contains(target))) return;
    hidePopover();
  }
  function onKeyDown(e){
    const pop = document.getElementById('cart-popover');
    if(e.key === 'Escape' && pop && pop.classList.contains('show')){
      hidePopover();
      return;
    }
    const bar = document.getElementById('cart-preview');
    if(!bar) return;
    if((e.key === 'Enter' || e.key === ' ') && document.activeElement === bar){
      e.preventDefault();
      togglePopover();
    }
  }

  function ensureBar(){
    let bar = document.getElementById('cart-preview');
    if(bar) return bar;
    bar = document.createElement('div');
    bar.id = 'cart-preview';
    bar.className = 'cart-preview-bar';
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', 'Abrir vista previa del carrito');
    bar.innerHTML = `
      <div class="bag" aria-hidden="true"><i class="bi bi-bag-check-fill"></i></div>
      <div class="summary"><span id="cart-count">0</span> productos en el carrito</div>
    `; // omit in-bar CTA; popover has CTA
    document.body.appendChild(bar);
    return bar;
  }

  function render() {
    const bar = ensureBar();
    if (!bar) return;
    const countEl = document.getElementById('cart-count');
    const summaryEl = bar.querySelector('.summary');

    const cart = getCart();
    const count = getCount(cart);

    if (countEl) countEl.textContent = String(count);
    if (summaryEl) {
      summaryEl.textContent = `${count} productos en el carrito`;
    }

    // Always visible across pages
    bar.classList.add('show');
    bar.setAttribute('aria-hidden', 'false');

    // Accessibility attributes
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', 'Abrir vista previa del carrito');

    // Attach click/keyboard toggle once
    if(!bar.dataset.popoverBound){
      bar.addEventListener('click', (ev) => {
        ev.preventDefault();
        togglePopover();
      });
      document.addEventListener('keydown', onKeyDown);
      bar.dataset.popoverBound = '1';
    }
  }

  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('cart:updated', (e) => {
    const detail = e.detail || {};
    const cart = getCart();

    if (typeof detail.items === 'object' && detail.items) {
      cart.items = detail.items;
      setCart(cart);
    } else if (typeof detail.productId !== 'undefined') {
      const id = String(detail.productId);
      const qty = Number(detail.qty || 1);
      cart.items[id] = (cart.items[id] || 0) + qty;
      setCart(cart);
    }

    render();
    // If popover is open, re-render it
    const pop = document.getElementById('cart-popover');
    if(pop && pop.classList.contains('show')) renderPopover();
  });
})();
