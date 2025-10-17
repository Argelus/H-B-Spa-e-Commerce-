// Controlador ligero para la vista previa del carrito.
// - Mantiene un recuento del carrito en localStorage para alimentar la barra de vista previa.
// - Escucha eventos personalizados `cart:updated` para refrescar la interfaz.
// - Muestra siempre la barra de vista previa, reemplazando el enlace del carrito en la barra de navegación en todo el sitio.

(function(){
  const STORAGE_KEY = 'hbspa_cart';
  const PRODUCTS_KEY = 'hbspa_products';

  // Resuelve la URL del Carrito de Compras relativa a la página actual.
  function computeCartUrl(){
    try {
      const path = (window.location && window.location.pathname) || '';
      // Si ya estamos dentro de /pages/, un enlace relativo es suficiente.
      if (path.includes('/pages/')) return 'ShoppingCart.html';
      // De lo contrario, enlaza a pages/ShoppingCart.html desde la raíz u otros directorios.
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
    } catch (e) { /* ignorar errores de escritura */ }
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
    // Botón de cerrar.
    pop.querySelector('#cart-popover-close').addEventListener('click', () => hidePopover());

    // Asegura que el CTA navegue de forma fiable.
    const ctaEl = pop.querySelector('#cart-popover-cta');
    if (ctaEl) {
      ctaEl.addEventListener('click', () => {
        const url = computeCartUrl();
        ctaEl.setAttribute('href', url);
        // Permite la navegación por defecto para los anclajes; no se usa preventDefault.
        hidePopover();
      });
    }

    // Delegación de eventos para acciones de cantidad y eliminación.
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
      // Notifica y vuelve a renderizar.
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

    // Actualiza el resumen del encabezado/pie de página.
    if(countPill) countPill.textContent = String(itemsCount);
    if(itemsLabel) itemsLabel.textContent = `${itemsCount} artículo${itemsCount===1?'':'s'}`;
    if(totalLabel) totalLabel.textContent = fmtCurrency(total);
    // Siempre permite navegar al carrito, incluso si está vacío.
    if(cta) {
      cta.classList.remove('disabled');
      cta.setAttribute('href', computeCartUrl());
      cta.setAttribute('aria-disabled', itemsCount === 0 ? 'true' : 'false');
    }

    if(entries.length === 0){
      body.innerHTML = `<div class="cart-popover-empty">Tu carrito está vacío.</div>`;
      return;
    }

    // Renderiza hasta 6 ítems para una vista previa compacta.
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
    `; // Se omite el CTA en la barra; el popover ya tiene uno.
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

    // Asegura que la insignia exista y actualiza solo el número.
    if (!countEl && summaryEl) {
      countEl = document.createElement('span');
      countEl.id = 'cart-count';
      summaryEl.appendChild(countEl);
    }
    if (countEl) countEl.textContent = String(count);

    // Siempre visible en todas las páginas.
    bar.classList.add('show');
    bar.setAttribute('aria-hidden', 'false');

    // Atributos de accesibilidad.
    bar.setAttribute('role', 'button');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('aria-label', 'Abrir vista previa del carrito');
    bar.setAttribute('aria-controls', 'cart-popover');
    if (!bar.hasAttribute('aria-expanded')) bar.setAttribute('aria-expanded', 'false');

    // Asocia el evento de toggle (click/teclado/táctil) una sola vez.
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
    // Si el popover está abierto, vuelve a renderizarlo.
    const pop = document.getElementById('cart-popover');
    if(pop && pop.classList.contains('show')) renderPopover();
  });
})();
