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
/*
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
  */

  function ensurePopover(){
  let pop = document.getElementById('cart-popover');
  if(pop) return pop;

  pop = document.createElement('div');
  pop.id = 'cart-popover';
  // Usamos TUS clases CSS existentes
  pop.className = 'side-modal'; 
  
  // Generamos el HTML que TU CSS espera
  pop.innerHTML = `
    <div class="side-modal-content">
      <div class="side-modal-header">
        <h3><i class="bi bi-cart3-fill"></i>Mi Carrito</h3>
        <button class="close-modal" type="button" aria-label="Cerrar">&times;</button>
      </div>
      <div class="side-modal-body" id="cart-popover-body">
              </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-amount" id="cart-popover-total">$0.00</span>
        </div>
        <a href="#" class="btn btn-turquesa w-100" id="cart-popover-cta">
          <i class="bi bi-credit-card me-2"></i>Proceder al Pago
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(pop);
  
  // Botón de cerrar (ahora usa la clase .close-modal)
  pop.querySelector('.close-modal').addEventListener('click', () => hidePopover());

  // Clic en el fondo para cerrar (basado en tu CSS .side-modal)
  pop.addEventListener('click', function(e) {
    if (e.target === pop) {
      hidePopover();
    }
  });

  // Asegura que el CTA navegue de forma fiable.
  const ctaEl = pop.querySelector('#cart-popover-cta');
  if (ctaEl) {
    ctaEl.addEventListener('click', () => {
      const url = computeCartUrl();
      ctaEl.setAttribute('href', url);
      hidePopover();
    });
  }

  // Delegación de eventos (esto no cambia)
  pop.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if(!actionBtn) return;
    const action = actionBtn.getAttribute('data-action');
    const itemEl = e.target.closest('.cart-popover-item'); 
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
/*
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
  */

  function renderPopover(){
  const pop = ensurePopover();
  const body = pop.querySelector('#cart-popover-body');
  const cta = pop.querySelector('#cart-popover-cta');
  const totalLabel = pop.querySelector('#cart-popover-total'); // footer
  cta.setAttribute('href', computeCartUrl());

  const cart = getCart();
  const map = getProductsMap();

  const entries = Object.entries(cart.items || {});
  const { itemsCount, total } = computeSummary(cart, map);

  // Actualiza el resumen del pie de página
  if(totalLabel) totalLabel.textContent = fmtCurrency(total);
  
  if(cta) {
    cta.classList.remove('disabled');
    cta.setAttribute('href', computeCartUrl());
    cta.setAttribute('aria-disabled', itemsCount === 0 ? 'true' : 'false');
    cta.style.display = itemsCount === 0 ? 'none' : ''; // Oculta si está vacío
  }

  if(entries.length === 0){
    // Usamos el HTML de tu CSS para el carrito vacío
    body.innerHTML = `
      <div class="cart-items-container">
        <div class="empty-cart">
          <i class="bi bi-cart-x" style="font-size: 5rem; color: var(--turquesa-pastel);"></i>
          <p class="mt-3 mb-2">Tu carrito está vacío</p>
          <p class="text-muted small mb-3">Agrega productos para comenzar tu compra</p>
          <a href="./Products.html" class="btn btn-turquesa">
            <i class="bi bi-shop me-2"></i>Explorar Productos
          </a>
        </div>
      </div>
    `;
    return;
  }

  // Renderiza los ítems
  // (Usaremos una estructura similar a la tuya de cart.css para reutilizar estilos)
  const parts = ['<div class="cart-items-container">', '<div class="cart-items">'];
  for(const [id, qty] of entries){
    const meta = map[String(id)] || {};
    const name = meta.name || `Producto #${id}`;
    const priceStr = (typeof meta.price !== 'undefined') ? fmtCurrency(meta.price) : '';
    const img = meta.imageUrl || 'https://via.placeholder.com/112x112?text=%F0%9F%9B%92';
    
    // NOTA: Esta clase "cart-popover-item" es inventada, 
    // pero la necesitamos para la delegación de eventos.
    // Le daremos estilos básicos que se parezcan a .cart-item
    parts.push(`
      <div class="cart-item cart-popover-item" data-id="${id}">
        <img src="${img}" alt="${name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-meta"><span class="price">${priceStr}</span></div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-stepper" aria-label="Cantidad">
            <button class="qty-btn" data-action="dec" aria-label="Disminuir">-</button>
            <div class="qty-value">${qty}</div>
            <button class="qty-btn" data-action="inc" aria-label="Aumentar">+</button>
          </div>
          <button class="btn-remove" data-action="remove" aria-label="Quitar"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `);
  }
  parts.push('</div></div>');
  body.innerHTML = parts.join('');
}

/*
function showPopover(){
  const pop = ensurePopover();
  renderPopover();
  pop.classList.add('show');
 
  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  if (buttons) buttons.forEach(b => b.setAttribute('aria-expanded', 'true'));
  document.addEventListener('click', onDocumentClick, true);
}
  */
 function showPopover(){
  const pop = ensurePopover();
  renderPopover();
  pop.classList.add('active'); 
  document.body.style.overflow = 'hidden';
  
  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  if (buttons) buttons.forEach(b => b.setAttribute('aria-expanded', 'true'));
  document.addEventListener('click', onDocumentClick, true);
}
/*
function hidePopover(){
  const pop = document.getElementById('cart-popover');
  if(pop){ pop.classList.remove('show'); }

  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  if (buttons) buttons.forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.removeEventListener('click', onDocumentClick, true);
}
*/
function hidePopover(){
  const pop = document.getElementById('cart-popover');
  if(pop){ pop.classList.remove('active'); } 
  document.body.style.overflow = ''; 

  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  if (buttons) buttons.forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.removeEventListener('click', onDocumentClick, true);
}
function onDocumentClick(e){
  const pop = document.getElementById('cart-popover');

  const bubble = e.target.closest('#openCartBtn, #openCartBtnMobile');
  if(!pop) return;
  const target = e.target;

  if(pop.contains(target) || bubble) return; 
  hidePopover();
}
/*
function onKeyDown(e){
  const pop = document.getElementById('cart-popover');
  if(e.key === 'Escape' && pop && pop.classList.contains('show')){
    hidePopover();
    return;
  }
  
  const activeBtn = document.activeElement;
  const isCartButton = activeBtn && (activeBtn.id === 'openCartBtn' || activeBtn.id === 'openCartBtnMobile');

  if((e.key === 'Enter' || e.key === ' ') && isCartButton){
    e.preventDefault();
    togglePopover();
  }
}*/

function onKeyDown(e){
  const pop = document.getElementById('cart-popover');
  // Corregido para usar .active
  if(e.key === 'Escape' && pop && pop.classList.contains('active')){
    hidePopover();
    return;
  }
  
  const activeBtn = document.activeElement;
  const isCartButton = activeBtn && (activeBtn.id === 'openCartBtn' || activeBtn.id === 'openCartBtnMobile');

  if((e.key === 'Enter' || e.key === ' ') && isCartButton){
    e.preventDefault();
    togglePopover();
  }
}

function bindHeaderButtons() {

  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  
  if (buttons.length === 0) return;

  const onToggle = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    togglePopover(); 
  };

  buttons.forEach(bar => {
    if (!bar.dataset.popoverBound) {
      bar.addEventListener('click', onToggle);
      bar.addEventListener('touchend', onToggle, { passive: false });
      bar.dataset.popoverBound = '1';
      
 
      bar.setAttribute('aria-controls', 'cart-popover');
      if (!bar.hasAttribute('aria-expanded')) bar.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', onKeyDown);
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

  

function updateHeaderBadges() {
 const cart = getCart();
 const count = getCount(cart);

  // Selecciona los contadores del header (desktop y móvil)
 const badges = document.querySelectorAll('.cart-badge, .cart-badge-mobile');
 
  badges.forEach(badge => {
    badge.textContent = String(count);
 // Muestra u oculta el badge si es cero
    if (count > 0) {
      badge.style.display = ''; // Quita el 'none'
      badge.classList.remove('d-none');
    } else {
      badge.style.display = 'none'; // Oculta si es 0
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges(); 
  bindHeaderButtons(); 
});
/*
window.addEventListener('cart:updated', (e) => {
  const detail = e.detail || {};
  const cart = getCart();

  // 🔹 Evitar doble incremento
  if (typeof detail.items === 'object' && detail.items) {
    cart.items = detail.items;
    setCart(cart);
  } 
  
  updateHeaderBadges(); 
  const pop = document.getElementById('cart-popover');
  if (pop && pop.classList.contains('show')) {
    renderPopover();
  }
});

*/
window.addEventListener('cart:updated', (e) => {
  const detail = e.detail || {};
  const cart = getCart();

  // 🔹 Evitar doble incremento
  if (typeof detail.items === 'object' && detail.items) {
    cart.items = detail.items;
    setCart(cart);
  } 
  
  updateHeaderBadges(); 

  // Corregido para usar .active
  const pop = document.getElementById('cart-popover');
  if (pop && pop.classList.contains('active')) { 
    renderPopover();
  }
});

function togglePopover(){
  const pop = ensurePopover();
  // Usamos .active, que coincide con tu CSS
  if(pop.classList.contains('active')) {
    hidePopover();
  } else {
    showPopover();
  }
}



})();


