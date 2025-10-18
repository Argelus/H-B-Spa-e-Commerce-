// =====================================
//  Carrito de Compras - H&B SPA (v2)
//  Combina hbspa_cart + hbspa_products
// =====================================

const CART_KEY = "hbspa_cart";
const PRODUCTS_KEY = "hbspa_products";

// Obtener carrito
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { items: {} };
  } catch {
    return { items: {} };
  }
}

// Obtener lista de productos completa
function getProductsData() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || {};
  } catch {
    return {};
  }
}

// Guardar carrito
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Renderizar carrito
function renderCart() {
    

  const container = document.getElementById("cart-items");
  const empty = document.getElementById("cart-empty");
  const countEl = document.getElementById("cart-count-summary");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const cart = getCart();
  const allProducts = getProductsData();

  const items = Object.entries(cart.items || {});
  container.innerHTML = "";

  if (items.length === 0) {
    if (empty) empty.classList.remove("d-none");
    if (countEl) countEl.textContent = "0";
    if (totalEl) totalEl.textContent = "$0.00";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (empty) empty.classList.add("d-none");
  if (checkoutBtn) checkoutBtn.disabled = false;

  let total = 0;
  let totalCount = 0;

  items.forEach(([id, qty]) => {
    const product = allProducts[id];
    if (!product) return;

    const subtotal = product.price * qty;
    total += subtotal;
    totalCount += qty;

    const div = document.createElement("div");
    div.className =
      "d-flex align-items-center justify-content-between p-2 rounded bg-white shadow-sm";

    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${product.imageUrl}" alt="${product.name}" class="me-3" 
          style="width:70px; height:70px; object-fit:cover; border-radius:8px;">
        <div>
          <h6 class="mb-0 fw-semibold">${product.name}</h6>
          <small class="text-muted">$${product.price.toFixed(2)}</small>
        </div>
      </div>
      <div class="text-end">
        <div class="btn-group btn-group-sm mb-1" role="group">
          <button class="btn btn-outline-secondary minus" data-id="${id}">
            <i class="bi bi-dash"></i>
          </button>
          <span class="btn btn-light disabled">${qty}</span>
          <button class="btn btn-outline-secondary plus" data-id="${id}">
            <i class="bi bi-plus"></i>
          </button>
        </div>
        <p class="fw-bold mb-1">$${subtotal.toFixed(2)}</p>
        <button class="btn btn-sm btn-outline-danger remove" data-id="${id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    container.appendChild(div);
  });

  if (countEl) countEl.textContent = totalCount;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Manejar botones (+, -, eliminar)
document.addEventListener("click", (e) => {
  const cart = getCart();
  const btn = e.target.closest(".plus, .minus, .remove");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!cart.items[id]) return;

  if (btn.classList.contains("plus")) cart.items[id]++;
  if (btn.classList.contains("minus")) cart.items[id] = Math.max(0, cart.items[id] - 1);
  if (btn.classList.contains("remove") || cart.items[id] === 0) delete cart.items[id];

  saveCart(cart);
  renderCart();
});

// Inicializar
document.addEventListener("DOMContentLoaded", renderCart);
