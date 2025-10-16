const API_URL = "http://localhost:8080/api";

// 🔹 Cargar todos los productos al iniciar
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    // Cache metadata for cart popover
    try {
      const map = {};
      products.forEach(p => {
        if(!p || typeof p.id === 'undefined') return;
        map[String(p.id)] = { id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl };
      });
      localStorage.setItem('hbspa_products', JSON.stringify(map));
    } catch {}

    const container = document.getElementById("product-list");
    if (!container) return;
    container.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("col-md-4");
      card.innerHTML = `
        <div class="card mb-4 shadow-sm">
          <img src="${product.imageUrl || 'https://via.placeholder.com/350x150'}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description || 'Sin descripción disponible.'}</p>
            <p class="fw-bold text-success">$${product.price}</p>
            <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
              <i class="bi bi-cart-plus"></i> Agregar al carrito
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Local cart helpers for preview bar
const STORAGE_KEY = 'hbspa_cart';
function getLocalCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { items: {}, updatedAt: 0 };
    parsed.items = parsed.items || {};
    return parsed;
  } catch { return { items: {}, updatedAt: 0 }; }
}
function setLocalCart(cart) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart.items || {}, updatedAt: Date.now() })); } catch {}
}
function updateLocalCart(productId, qty) {
  const cart = getLocalCart();
  const id = String(productId);
  cart.items[id] = (cart.items[id] || 0) + (qty || 1);
  setLocalCart(cart);
  // Notify preview bars
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { productId, qty } }));
}

// 🔹 Agregar producto al carrito
async function addToCart(productId) {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (response.ok) {
      updateLocalCart(productId, 1);
      alert("Producto agregado al carrito 🛒");
    } else {
      // Even if backend fails, still update the preview for UX continuity
      updateLocalCart(productId, 1);
      alert("Producto agregado al carrito (offline) 🛒");
    }

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    // Fallback to local preview
    updateLocalCart(productId, 1);
    alert("Producto agregado al carrito (sin conexión) 🛒");
  }
}

// 🔹 Cargar productos al abrir la página
document.addEventListener("DOMContentLoaded", loadProducts);
