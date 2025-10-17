const API_URL = "http://localhost:8080/api";

// Carga todos los productos al iniciar la página.
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    // Almacena en caché los metadatos de los productos para el popover del carrito.
    try {
      const productMap = products.reduce((map, product) => {
        if (product && typeof product.id !== 'undefined') {
          map[String(product.id)] = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
          };
        }
        return map;
      }, {});
      localStorage.setItem('hbspa_products', JSON.stringify(productMap));
    } catch (e) {
      console.error("Error al guardar productos en caché:", e);
    }

    const container = document.getElementById("product-list");
    if (!container) return;

    container.innerHTML = ""; // Limpia el contenedor antes de añadir nuevos productos.

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "col-md-4";
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

// Helpers para gestionar el carrito localmente para la barra de vista previa.
const STORAGE_KEY = 'hbspa_cart';

function getLocalCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { items: {}, updatedAt: 0 };
    parsed.items = parsed.items || {};
    return parsed;
  } catch {
    return { items: {}, updatedAt: 0 };
  }
}

function setLocalCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart.items || {}, updatedAt: Date.now() }));
  } catch (e) {
    console.error("Error al guardar el carrito local:", e);
  }
}

function updateLocalCart(productId, qty) {
  const cart = getLocalCart();
  const id = String(productId);
  cart.items[id] = (cart.items[id] || 0) + (qty || 1);
  setLocalCart(cart);
  // Notifica a la barra de vista previa para que se actualice.
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { productId, qty } }));
}

// Agrega un producto al carrito.
async function addToCart(productId) {
  // Actualiza la UI local inmediatamente para una mejor experiencia de usuario.
  updateLocalCart(productId, 1);
  alert("Producto agregado al carrito 🛒");

  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (!response.ok) {
      // Si la API falla, el cambio ya está reflejado localmente.
      // Se podría implementar una lógica para revertir si la sincronización es crítica.
      console.warn("El producto se agregó localmente, pero falló la sincronización con el servidor.");
    }
  } catch (error) {
    console.error("Error al agregar al carrito (sin conexión):", error);
    // El producto ya fue agregado localmente, por lo que la UI es consistente.
  }
}

// Carga los productos cuando la página esté lista.
document.addEventListener("DOMContentLoaded", loadProducts);
