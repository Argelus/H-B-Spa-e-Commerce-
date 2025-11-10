const API_URL = "http://localhost:8080/api";

let editingProductId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("hbspa_token");

  if (!token) {
    window.location.href = "admin-login.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role || payload.authorities || null;

    console.log("🔍 Token cargado:", payload);

    if (userRole !== "ADMIN" && userRole !== "ROLE_ADMIN") {
      alert("⚠️ Acceso denegado: no tienes permisos de administrador.");
      localStorage.removeItem("hbspa_token");
      window.location.href = "admin-login.html";
      return;
    }
  } catch (error) {
    console.error("Error al validar token:", error);
    localStorage.removeItem("hbspa_token");
    window.location.href = "admin-login.html";
    return;
  }

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("hbspa_token");
  window.location.href = "admin-login.html";
});

  await loadProducts();
  await loadCategories();

  const imageInput = document.getElementById("imageUpload");
  imageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const msg = document.getElementById("form-message");
      msg.textContent = "☁️ Subiendo imagen...";
      msg.classList.remove("text-danger", "text-success");
      msg.style.display = "block";

      const url = await uploadImageToCloudinary(file);
      if (url) {
        msg.textContent = "✅ Imagen subida correctamente.";
        msg.classList.add("text-success");
      } else {
        msg.textContent = "❌ Error al subir la imagen.";
        msg.classList.add("text-danger");
      }
    }
  });

  document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await addProduct();
  });
});

async function loadProducts() {
  const tableBody = document.querySelector("#product-table tbody");
  tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Cargando...</td></tr>`;

  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("hbspa_token")}` },
    });
    if (!response.ok) throw new Error("Error al obtener productos");
    const data = await response.json();
    renderProducts(data);
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar productos.</td></tr>`;
  }
}

function renderProducts(products) {
  const tableBody = document.querySelector("#product-table tbody");
  tableBody.innerHTML = "";

  if (!products || products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Sin productos registrados.</td></tr>`;
    return;
  }

  products.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.contenido || "-"}</td>
      <td><img src="${p.imageUrl}" alt="${p.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"></td>
      <td>
  <button class="btn btn-warning btn-sm me-1" onclick="editProduct(${p.id})">
    <i class="bi bi-pencil-square"></i>
  </button>
  <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">
    <i class="bi bi-trash"></i>
  </button>
</td>

    `;
    tableBody.appendChild(row);
  });
}

async function loadCategories() {
  const select = document.getElementById("categoryId");
  select.innerHTML = `<option value="">Cargando categorías...</option>`;

  try {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();

    select.innerHTML = `<option value="">Seleccionar categoría</option>`;
    categories.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    select.innerHTML = `<option value="">Error al cargar categorías</option>`;
  }
}

async function uploadImageToCloudinary(file) {
const CLOUD_NAME = "do7kza5l3";  // Cloud Name 
const UPLOAD_PRESET = "hbspa_upload";  //preset

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(url, { method: "POST", body: formData });
    const data = await response.json();
    document.getElementById("imageUrl").value = data.secure_url;
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return null;
  }
}

async function addProduct() {
  const token = localStorage.getItem("hbspa_token");
  const formMsg = document.getElementById("form-message");

  const nameValue = document.getElementById("name").value.trim();
const priceValue = parseFloat(document.getElementById("price").value);
const stockValue = parseInt(document.getElementById("stock").value);
const descriptionValue = document.getElementById("description").value.trim();
const contenidoValue = document.getElementById("contenido").value.trim();
const imageUrlValue = document.getElementById("imageUrl").value.trim();
const categoryIdValue = parseInt(document.getElementById("categoryId").value);

const product = {
  name: nameValue || null,
  price: isNaN(priceValue) ? 0 : priceValue,
  stock: isNaN(stockValue) ? 0 : stockValue,
  description: descriptionValue || null,
  contenido: contenidoValue || null,
  imageUrl: imageUrlValue || null,
  category: categoryIdValue ? { id: categoryIdValue } : null,
};


  try {
    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId
      ? `${API_URL}/products/${editingProductId}`
      : `${API_URL}/products`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Error al guardar producto");

    formMsg.textContent = editingProductId
      ? "✅ Producto actualizado correctamente."
      : "✅ Producto agregado exitosamente.";
    formMsg.className = "text-success";
    formMsg.style.display = "block";
    // ⏳ Ocultar mensaje automáticamente después de 4 segundos
setTimeout(() => {
  formMsg.style.display = "none";
}, 4000);

    document.getElementById("product-form").reset();
    editingProductId = null;
    const btn = document.querySelector("#product-form button[type='submit']");
    btn.innerHTML = `<i class="bi bi-plus-circle"></i> Agregar producto`;
    btn.classList.remove("btn-success");
    btn.classList.add("btn-primary");

    await loadProducts();
  } catch (err) {
    console.error("❌ Error al guardar producto:", err);
    formMsg.textContent = "❌ Error al guardar producto.";
    formMsg.className = "text-danger";
    formMsg.style.display = "block";
  }
}

async function deleteProduct(id) {
  const token = localStorage.getItem("hbspa_token");
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al eliminar producto");
    await loadProducts();
  } catch (err) {
    console.error("❌ Error al eliminar producto:", err);
    alert("No autorizado o error al eliminar producto.");
  }
}

async function editProduct(id) {
  const token = localStorage.getItem("hbspa_token");
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    const product = await response.json();

    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;
    document.getElementById("contenido").value = product.contenido || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("imageUrl").value = product.imageUrl || "";
    document.getElementById("categoryId").value = product.category?.id || "";
    if (product.category) {
    document.getElementById("categorySelect").value = product.category.id;
}

    editingProductId = id;
    const btn = document.querySelector("#product-form button[type='submit']");
    btn.innerHTML = `<i class="bi bi-save"></i> Actualizar producto`;
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-success");
    const msg = document.getElementById("form-message");
    msg.textContent = "✏️ Editando producto ID " + id;
    msg.className = "text-warning text-center fw-semibold";
    msg.style.display = "block";

window.scrollTo({
  top: 0,
  behavior: "smooth"
});


  } catch (err) {
    console.error("Error al cargar producto:", err);
    alert("No se pudo cargar el producto para editar.");
  }
}

