const API_URL = "http://localhost:8080/api";

// 🔹 Cargar categorías y productos
async function loadProducts() {
  const container = document.getElementById("product-list");
  
  // 🔹 Mostrar loading spinner
  showLoadingSpinner(container);
  
  try {
    // --- 1️⃣ Obtener categorías ---
    const catResponse = await fetch(`${API_URL}/categories`);
    const categories = await catResponse.json();
    renderCategories(categories);

    // --- 2️⃣ Obtener productos ---
    const prodResponse = await fetch(`${API_URL}/products`);
    const products = await prodResponse.json();

    // Cachear metadatos (para carrito y resumen)
    const map = {};
    products.forEach(p => {
      if (!p || typeof p.id === "undefined") return;
      map[String(p.id)] = {
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl
      };
    });
    localStorage.setItem("hbspa_products", JSON.stringify(map));

    // 🔹 Ocultar loading y renderizar productos
    hideLoadingSpinner(container);
    renderProducts(products);
    
    // 🔹 Inicializar efectos después de renderizar productos
    setTimeout(() => {
      initScrollAnimations();
      addExtraInfoToCards();
    }, 100);
    
  } catch (error) {
    console.error("Error cargando productos:", error);
    // 🔹 Mostrar mensaje de error
    showErrorMessage(container);
  }
}

// 🔹 Mostrar spinner de carga
function showLoadingSpinner(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">
          <i class="bi bi-hourglass-split me-2"></i>
          Cargando productos...
        </p>
      </div>
    </div>
  `;
}

// 🔹 Ocultar spinner de carga
function hideLoadingSpinner(container) {
  if (!container) return;
  const loadingEl = container.querySelector('.loading-container');
  if (loadingEl) {
    loadingEl.remove();
  }
}

// 🔹 Mostrar mensaje de error
function showErrorMessage(container) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-container">
      <i class="bi bi-exclamation-triangle error-icon"></i>
      <h3 class="error-title">No pudimos cargar los productos</h3>
      <p class="error-text">Por favor, verifica tu conexión e inténtalo de nuevo.</p>
      <button class="btn btn-primary retry-btn" onclick="loadProducts()">
        <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
      </button>
    </div>
  `;
}

// 🔹 Renderizar categorías
function renderCategories(categories) {
  const container = document.getElementById("category-list");
  if (!container) return;

  container.innerHTML = `
    <button class="btn btn-outline-primary active" data-category="all">
      <i class="bi bi-grid"></i> Todos
    </button>
  `;

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.dataset.category = cat.id;
    btn.textContent = cat.name;
    btn.addEventListener("click", () => filterByCategory(cat.id));
    container.appendChild(btn);
  });
}

// 🔹 Filtrar productos por categoría
async function filterByCategory(categoryId) {
  const container = document.getElementById("product-list");
  
  // 🔹 Mostrar loading al filtrar
  showLoadingSpinner(container);
  
  const allBtns = document.querySelectorAll("#category-list button");
  allBtns.forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`#category-list button[data-category="${categoryId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  try {
    const response = categoryId === "all"
      ? await fetch(`${API_URL}/products`)
      : await fetch(`${API_URL}/products/category/${categoryId}`);

    const products = await response.json();
    
    // 🔹 Ocultar loading y renderizar
    hideLoadingSpinner(container);
    renderProducts(products);
    
    // 🔹 Re-inicializar efectos después de filtrar
    setTimeout(() => {
      initScrollAnimations();
      addExtraInfoToCards();
    }, 100);
  } catch (error) {
    console.error("Error filtrando productos:", error);
    showErrorMessage(container);
  }
}

// 🔹 Renderizar productos
function renderProducts(products) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "d-flex");

    // 🔹 Formatear precio con signo de pesos
    const precioFormateado = product.price.toString().startsWith('$') 
      ? `${product.price} MXN` 
      : `$${product.price} MXN`;

    card.innerHTML = `
      <div class="card mb-4 shadow-sm flex-fill">
        <img src="${product.imageUrl || 'https://via.placeholder.com/350x150'}"
             class="card-img-top" alt="${product.name}">
        <div class="card-body text-center d-flex flex-column justify-content-between flex-grow-1">
          <div>
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description || 'Sin descripción disponible.'}</p>
            <p class="fw-bold text-success">${precioFormateado}</p>
          </div>

          <!-- 🔹 Contenedor fijo del botón -->
          <div class="card-actions">
            <button class="btn btn-primary w-100 mb-2 add-to-cart-btn" data-id="${product.id}">
              <i class="bi bi-cart-plus"></i> Agregar al carrito
            </button>
            <div class="added-msg text-success fw-semibold">
              <i class="bi bi-check-circle"></i> Agregado al carrito
            </div>
          </div>

          <p class="text-muted mb-0"><small>Stock disponible: ${product.stock}</small></p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Reasignar eventos después de renderizar
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      addToCart(productId, btn);
    });
  });
}

// ============================================
// 🔹 EFECTO DE APARICIÓN AL HACER SCROLL
// ============================================

/**
 * Observa cuando las cards entran en el viewport y les agrega
 * la clase 'visible' para activar la animación
 */
function initScrollAnimations() {
  // Configuración del Intersection Observer
  const observerOptions = {
    root: null, // usa el viewport del navegador
    rootMargin: '0px',
    threshold: 0.1 // Se activa cuando el 10% del elemento es visible
  };

  // Callback que se ejecuta cuando un elemento entra/sale del viewport
  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Añade un pequeño delay escalonado para efecto cascada
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // 100ms de delay entre cada card
        
        // Deja de observar este elemento una vez que ya apareció
        observer.unobserve(entry.target);
      }
    });
  };

  // Crea el observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observa todas las cards de productos
  const cards = document.querySelectorAll('#product-list .card');
  cards.forEach(card => {
    observer.observe(card);
  });
}

// ============================================
// 🔹 AGREGAR INFORMACIÓN EXTRA EN HOVER
// ============================================

/**
 * Ya no necesitamos esta función porque la información
 * se muestra directamente desde el HTML renderizado
 */
function addExtraInfoToCards() {
  // Función vacía - la información ya está en el HTML
  return;
}

// ============================================
// 🔹 CARRITO LOCAL
// ============================================

const STORAGE_KEY = "hbspa_cart";

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      items: cart.items || {},
      updatedAt: Date.now()
    }));
  } catch {}
}

function updateLocalCart(productId, qty) {
  const cart = getLocalCart();
  const id = String(productId);
  cart.items[id] = (cart.items[id] || 0) + (qty || 1);
  setLocalCart(cart);
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { productId, qty } }));
}

// 🔹 Agregar producto al carrito
async function addToCart(productId, btn) {
  try {
    updateLocalCart(productId, 1);

    // Mostrar mensaje sin mover el botón
    const msg = btn.parentElement.querySelector(".added-msg");
    if (msg) {
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 1800);
    }

    // Enviar al backend (no bloqueante)
    await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
  }
}

// 🔹 Inicializar
document.addEventListener("DOMContentLoaded", loadProducts);