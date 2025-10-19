const API_URL = "http://localhost:8080/api";

// ✅ Al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("hbspa_token");

  if (!token) {
    window.location.href = "admin-login.html";
    return;
  }

  // 🔐 Verificar rol admin
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

  // 🚪 Cerrar sesión
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("hbspa_token");
    window.location.href = "admin-login.html";
  });

  // 📦 Cargar datos iniciales
  await loadProducts();
  await loadCategories();

  // ☁️ Evento de subida de imagen
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

  // ➕ Evento de formulario
  document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await addProduct();
  });
});

// 🧾 Cargar productos
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

// 🧱 Renderizar productos
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
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// 🧭 Cargar categorías
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

// ☁️ Subir imagen a Cloudinary
async function uploadImageToCloudinary(file) {
const CLOUD_NAME = "do7kza5l3";  // 👈 este es tu Cloud Name (arriba a la izquierda)
const UPLOAD_PRESET = "hbspa_upload";  // 👈 el nombre del preset que creaste

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

// ➕ Agregar producto
async function addProduct() {
  const token = localStorage.getItem("hbspa_token");
  const formMsg = document.getElementById("form-message");

  const product = {
    name: document.getElementById("name").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    description: document.getElementById("description").value,
    contenido: document.getElementById("contenido").value,
    imageUrl: document.getElementById("imageUrl").value,
    category: { id: parseInt(document.getElementById("categoryId").value) },
  };

  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Error al agregar producto");
    formMsg.textContent = "✅ Producto agregado exitosamente.";
    formMsg.className = "text-success";
    formMsg.style.display = "block";

    await loadProducts();
    document.getElementById("product-form").reset();
  } catch (err) {
    console.error("❌ Error al agregar producto:", err);
    formMsg.textContent = "❌ No autorizado o error al agregar producto.";
    formMsg.className = "text-danger";
    formMsg.style.display = "block";
  }
}

// 🗑️ Eliminar producto
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
