

(function(){
  const STORAGE_KEY = 'hbspa_cart';
  const PRODUCTS_KEY = 'hbspa_products';

  function computeCartUrl(){
    try {
      const path = (window.location && window.location.pathname) || '';
      if (path.includes('/pages/')) return 'ShoppingCart.html';
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
    } catch (e) { }
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

  pop.className = 'side-modal'; 
  

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

  pop.querySelector('.close-modal').addEventListener('click', () => hidePopover());

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

  // Delegación de eventos 
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
    cta.style.display = itemsCount === 0 ? 'none' : ''; 
  }

  if(entries.length === 0){
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

  const parts = ['<div class="cart-items-container">', '<div class="cart-items">'];
  for(const [id, qty] of entries){
    const meta = map[String(id)] || {};
    const name = meta.name || `Producto #${id}`;
    const priceStr = (typeof meta.price !== 'undefined') ? fmtCurrency(meta.price) : '';
    const img = meta.imageUrl || 'https://via.placeholder.com/112x112?text=%F0%9F%9B%92';
    

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


 function showPopover(){
  const pop = ensurePopover();
  renderPopover();
  pop.classList.add('active'); 
  document.body.style.overflow = 'hidden';
  
  const buttons = document.querySelectorAll('#openCartBtn, #openCartBtnMobile');
  if (buttons) buttons.forEach(b => b.setAttribute('aria-expanded', 'true'));
  document.addEventListener('click', onDocumentClick, true);
}

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


function onKeyDown(e){
  const pop = document.getElementById('cart-popover');
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


