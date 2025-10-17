// Lightweight cart preview controller
// - Keeps a small cart count in localStorage to power the preview bar
// - Listens for `cart:updated` custom events to refresh the UI
// - Always shows the preview bar (replacing the navbar cart link site-wide)

(function(){
  const STORAGE_KEY = 'hbspa_cart';
  const PRODUCTS_KEY = 'hbspa_products';

  // Resolve the Shopping Cart URL relative to current page
  function computeCartUrl(){
    try {
      const path = (window.location && window.location.pathname) || '';
      // If we're already inside /pages/, a relative link is enough
      if (path.includes('/pages/')) return 'ShoppingCart.html';
      // Otherwise, link to pages/ShoppingCart.html from root or other dirs
      return 'pages/ShoppingCart.html';
    } catch {
      return 'pages/ShoppingCart.html';
    }
  }

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
      return JSON.parse(raw) || {};
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
        <div class="count-pill"><i class="bi bi-bag-fill"></i><span id="cart-popover-count">0</span></div>
        <button type="button" class="btn btn-sm btn-light" id="cart-popover-close" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="cart-popover-body" id="cart-popover-body"></div>
      <div class="cart-popover-footer">
        <div class="cart-summary"><span class="items" id="cart-popover-items">0 artículos</span><span class="total" id="cart-popover-total">$0.00</span></div>
        <a class="btn btn-primary btn-cart" id="cart-popover-cta" href="#">Ver carrito</a>
      </div>
    `;
    document.body.appendChild(pop);
    // Close button
    pop.querySelector('#cart-popover-close').addEventListener('click', () => hidePopover());

    // Ensure CTA navigates reliably
    const ctaEl = pop.querySelector('#cart-popover-cta');
    if (ctaEl) {
      ctaEl.addEventListener('click', () => {
        const url = computeCartUrl();
        ctaEl.setAttribute('href', url);
        // allow default navigation for anchors; do not preventDefault
        hidePopover();
      });
    }

    // Event delegation for qty and remove actions
    pop.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if(!actionBtn) return;
      const action = actionBtn.getAttribute('data-action');
      const itemEl = actionBtn.closest('.cart-popover-item');
      if(!itemEl) return;
      const id = itemEl.getAttribute('data-id');
      if(!id) return;

      const cart = getCart();
      const current = Number(cart.items[id] || 0);
      if(action === 'inc') {
        cart.items[id] = current + 1;
      } else if(action === 'dec') {
        cart.items[id] = Math.max(0, current - 1);
        if(cart.items[id] === 0) delete cart.items[id];
      } else if(action === 'remove') {
        delete cart.items[id];
      }
      setCart(cart);
      // Notify and re-render
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items: cart.items } }));
      renderPopover();
    });
    return pop;
  }

  function fmtCurrency(n){
    const num = Number(n);
    if(!isFinite(num)) return '';
    try { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num); }
    catch { return `$${num.toFixed(2)}`; }
  }

  function computeSummary(cart, map){
    const entries = Object.entries(cart.items || {});
    let itemsCount = 0;
    let total = 0;
    for(const [id, qtyRaw] of entries){
      const qty = Number(qtyRaw) || 0;
      itemsCount += qty;
      const price = Number((map[id] && map[id].price) ?? 0) || 0;
      total += qty * price;
    }
    return { itemsCount, total };
  }

  function renderPopover(){
    const pop = ensurePopover();
    const body = pop.querySelector('#cart-popover-body');
    const cta = pop.querySelector('#cart-popover-cta');
    const countPill = pop.querySelector('#cart-popover-count');
    const itemsLabel = pop.querySelector('#cart-popover-items');
    const totalLabel = pop.querySelector('#cart-popover-total');
    cta.setAttribute('href', computeCartUrl());

    const cart = getCart();
    const map = getProductsMap();

    const entries = Object.entries(cart.items || {});
    const { itemsCount, total } = computeSummary(cart, map);

    // Update header/footer summary
    if(countPill) countPill.textContent = String(itemsCount);
    if(itemsLabel) itemsLabel.textContent = `${itemsCount} artículo${itemsCount===1?'':'s'}`;
    if(totalLabel) totalLabel.textContent = fmtCurrency(total);
    // Always allow navigating to the cart, even if it's empty
    if(cta) {
      cta.classList.remove('disabled');
      cta.setAttribute('href', computeCartUrl());
      cta.setAttribute('aria-disabled', itemsCount === 0 ? 'true' : 'false');
    }

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
      const priceStr = (typeof meta.price !== 'undefined') ? fmtCurrency(meta.price) : '';
      const img = meta.imageUrl || 'https://via.placeholder.com/112x112?text=%F0%9F%9B%92';
      parts.push(`
        <div class="cart-popover-item" data-id="${id}">
          <img src="${img}" alt="${name}">
          <div class="info">
            <div class="name">${name}</div>
            <div class="meta"><span class="price">${priceStr}</span></div>
          </div>
          <div class="actions">
            <div class="qty-controls" aria-label="Cantidad">
              <button class="btn-qty" data-action="dec" aria-label="Disminuir">-</button>
              <div class="qty">${qty}</div>
              <button class="btn-qty" data-action="inc" aria-label="Aumentar">+</button>
            </div>
            <button class="btn-remove" data-action="remove" aria-label="Quitar"><i class="bi bi-trash"></i></button>
          </div>
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
    const bubble = document.getElementById('cart-preview');
    if (bubble) bubble.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocumentClick, true);
  }
  function hidePopover(){
    const pop = document.getElementById('cart-popover');
    if(pop){ pop.classList.remove('show'); }
    const bubble = document.getElementById('cart-preview');
    if (bubble) bubble.setAttribute('aria-expanded', 'false');
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
    const summaryEl = bar.querySelector('.summary');
    let countEl = bar.querySelector('#cart-count');

    const cart = getCart();
    const count = getCount(cart);

    // Ensure badge exists and update only the number
    if (!countEl && summaryEl) {
      countEl = document.createElement('span');
      countEl.id = 'cart-count';
      summaryEl.appendChild(countEl);
    }
    if (countEl) countEl.textContent = String(count);

    // Always visible across pages
    bar.classList.add('show');
    bar.setAttribute('aria-hidden', 'false');

    // Accessibility attributes
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', 'Abrir vista previa del carrito');
    bar.setAttribute('aria-controls', 'cart-popover');
    if (!bar.hasAttribute('aria-expanded')) bar.setAttribute('aria-expanded', 'false');

    // Attach click/keyboard/touch toggle once
    if(!bar.dataset.popoverBound){
      const onToggle = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        togglePopover();
      };
      bar.addEventListener('click', onToggle);
      bar.addEventListener('touchend', onToggle, { passive: false });
      document.addEventListener('keydown', onKeyDown);
      bar.dataset.popoverBound = '1';
    }

    // After rendering the bar ensure the FAQ modal is positioned relative to it
    // (if present on the page). This keeps the FAQ bubble aligned with the cart preview.
    positionFaqModal();
  }

  // Position the #faq-modal bubble relative to the #cart-preview bubble.
  // Strategy:
  // - Align the right edge of the FAQ bubble to the right edge of the cart preview.
  // - Prefer placing the FAQ bubble below the preview (increasing top), but if there
  //   isn't enough space below, place it above the preview.
  // - Clamp to viewport edges and re-calc on resize/scroll.
  function positionFaqModal() {
    try {
      const preview = document.getElementById('cart-preview');
      const faq = document.getElementById('faq-modal');
      if (!preview || !faq) return;

      const faqContent = faq.querySelector('.faq-modal-content');
      const gap = 10; // px gap between preview and modal

      const rect = preview.getBoundingClientRect();
      // Determine content size (fallback to 320 if not measurable)
      let contentWidth = 320;
      let contentHeight = 200;
      if (faqContent) {
        // Temporarily ensure it's measurable without flashing to the user
        const prevDisplay = faqContent.style.display;
        const wasHidden = getComputedStyle(faqContent).display === 'none' || getComputedStyle(faq).display === 'none';
        if (wasHidden) {
          faqContent.style.visibility = 'hidden';
          faqContent.style.display = 'block';
        }
        contentWidth = faqContent.offsetWidth || contentWidth;
        contentHeight = faqContent.offsetHeight || contentHeight;
        if (wasHidden) {
          faqContent.style.display = prevDisplay;
          faqContent.style.visibility = '';
        }
      }

      // Align right edge: compute right offset from viewport
      const rightOffset = Math.max(8, Math.round(window.innerWidth - rect.right));

      // Decide whether to place below or above depending on available space
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Clear positioning anchors first
      faq.style.left = '';
      faq.style.right = '';
      faq.style.top = '';
      faq.style.bottom = '';

      // Apply horizontal positioning via 'right' to keep it flush with preview
      faq.style.right = rightOffset + 'px';

      if (spaceBelow >= contentHeight + gap) {
        // place below (use top)
        const topPos = Math.round(rect.bottom + gap);
        faq.style.top = topPos + 'px';
      } else if (spaceAbove >= contentHeight + gap) {
        // place above (use bottom measured from viewport)
        const bottomPos = Math.round(window.innerHeight - rect.top + gap);
        faq.style.bottom = bottomPos + 'px';
      } else {
        // Not enough space either side: prefer above and clamp within viewport
        const bottomPos = Math.round(window.innerHeight - rect.top + gap);
        faq.style.bottom = bottomPos + 'px';
      }
    } catch (e) {
      // silently ignore positioning errors
    }
  }

  // Reposition FAQ modal on resize/scroll and when DOM changes (mutation observer)
  window.addEventListener('resize', () => positionFaqModal());
  window.addEventListener('scroll', () => positionFaqModal(), true);

  // Observe changes to cart-preview in case it moves or is recreated
  const mo = new MutationObserver(() => positionFaqModal());
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

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
