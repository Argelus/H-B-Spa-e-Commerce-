const API_URL = "http://localhost:8080/api";

// 🔹 Cargar todos los productos al iniciar
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();

    const container = document.getElementById("product-list");
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

// 🔹 Agregar producto al carrito
async function addToCart(productId) {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (response.ok) {
      alert("Producto agregado al carrito 🛒");
    } else {
      alert("Error al agregar el producto al carrito");
    }

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
  }
}

// 🔹 Cargar productos al abrir la página
document.addEventListener("DOMContentLoaded", loadProducts);
