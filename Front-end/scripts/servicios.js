const API_URL = "http://localhost:8080/api";
let servicios = [];
let categorias = [];

async function cargarServicios() {
  try {
    const response = await fetch(`${API_URL}/spa-services`);
    if (!response.ok) throw new Error("No se pueden obtener los servicios");

    servicios = await response.json();
    categorias = [...new Set(servicios.map(s => s.categoria))]; // Extrae categorías únicas

    llenarFiltroCategorias();
    mostrarServicios("todos");

    document.getElementById("loadingServices").classList.add("hidden");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loadingServices").innerHTML = `<p class="server-error">⚠️ No se pudo conectar con el servidor</p>`;
  }
}

function llenarFiltroCategorias() {
  const select = document.getElementById("categoriaSelect");
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    mostrarServicios(e.target.value);
  });
}

function mostrarServicios(filtro) {
  const grid = document.getElementById("servicesGrid");
  const filtrados = filtro === "todos" ? servicios : servicios.filter(s => s.categoria === filtro);

  if (filtrados.length === 0) {
    grid.innerHTML = `<p class="placeholder">No hay servicios en esta categoría</p>`;
    return;
  }

  grid.classList.remove("placeholder");
  grid.innerHTML = filtrados.map(servicio => `
    <div class="service-card">
      <div class="service-image" style="background-image: url('${servicio.imageUrl || 'https://via.placeholder.com/300x200'}');"></div>
      <div class="service-overlay">
        <h3>${servicio.name}</h3>
        <p>${servicio.description || "Servicio profesional de spa"}</p>
        <div class="service-info">
          <span class="service-price">$${servicio.price.toFixed(2)}</span>
          <span class="service-duration">⏱️ ${servicio.duration || "60 min"}</span>
        </div>
        
        <button class="btn btn-spa w-100 mt-3 btn-reservar-perfil" data-service-id="${servicio.id}">
           <i class="bi bi-calendar-plus me-2"></i>
           Reservar
        </button>
        </div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", cargarServicios);

document.getElementById("servicesGrid").addEventListener("click", function(event) {
  
    const botonReservar = event.target.closest(".btn-reservar-perfil");
    
    if (botonReservar) {
 
        const token = localStorage.getItem("token");

        if (token) {

            window.location.href = "profile.html#reservas";
        } else {
          
            localStorage.setItem("redirectAfterLogin", "profile.html#reservas");
            
            window.location.href = "Login.html";
        }
    }
});
