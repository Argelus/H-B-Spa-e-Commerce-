const categoriaButtonsContainer = document.getElementById("categoriaButtons");
const servicesGrid = document.getElementById("servicesGrid");
const loadingServices = document.getElementById("loadingServices");

let servicios = [];
let categorias = new Set();

async function cargarServiciosDesdeServidor() {
  try {
    loadingServices.classList.remove("hidden");

    const response = await fetch("http://localhost:8080/api/service-categories");
    if (!response.ok) throw new Error("Error al cargar los servicios");

    const data = await response.json();
    servicios = [];

    data.forEach(categoria => {
      if (Array.isArray(categoria.services)) {
        categoria.services.forEach(servicio => {
          servicios.push({
            id: servicio.id,
            nombre: servicio.name,
            descripcion: servicio.description,
            imagen: servicio.imageUrl,
            precio: servicio.price,
            duracion: servicio.duration,
            categoria: categoria.name
          });
        });
        categorias.add(categoria.name);
      }
    });

    renderBotonesCategorias();
    mostrarServicios("todos");

  } catch (error) {
    servicesGrid.innerHTML = `<p class="server-error">No se pudieron cargar los servicios. Intenta más tarde.</p>`;
    console.error("Error al obtener servicios:", error);
  } finally {
    loadingServices.classList.add("hidden");
  }
}

function renderBotonesCategorias() {
  categoriaButtonsContainer.innerHTML = "";

  const todasBtn = crearBotonCategoria("Todos", "todos");
  todasBtn.classList.add("active");
  categoriaButtonsContainer.appendChild(todasBtn);

  categorias.forEach(cat => {
    const btn = crearBotonCategoria(cat, cat);
    categoriaButtonsContainer.appendChild(btn);
  });
}

function crearBotonCategoria(texto, valor) {
  const btn = document.createElement("button");
  btn.textContent = texto;
  btn.className = "btn btn-outline-secondary rounded-pill";
  btn.dataset.categoria = valor;
  btn.onclick = () => {
    marcarActivo(btn);
    mostrarServicios(valor);
  };
  return btn;
}

function marcarActivo(botonSeleccionado) {
  const botones = categoriaButtonsContainer.querySelectorAll("button");
  botones.forEach(btn => btn.classList.remove("active"));
  botonSeleccionado.classList.add("active");
}

function mostrarServicios(categoria) {
  servicesGrid.innerHTML = "";

  const filtrados = categoria === "todos"
    ? servicios
    : servicios.filter(s => s.categoria === categoria);

  if (filtrados.length === 0) {
    servicesGrid.innerHTML = "<p class='placeholder'>No hay servicios en esta categoría.</p>";
    return;
  }

  filtrados.forEach(s => {
    const imagenUrl = s.imagen?.startsWith("http") ? s.imagen : `../images/${s.imagen}`;
    const card = document.createElement("div");
    card.className = "service-card";

    card.innerHTML = `
      <div class="service-image" style="background-image: url('${imagenUrl}')"></div>
      <div class="service-overlay">
        <h3>${s.nombre}</h3>
        <p>${s.descripcion}</p>
        <p class="service-info"> $${s.precio} MXN · ⏱️ ${s.duracion}</p>
        <button class="btn-agendar">Agendar</button>
      </div>
    `;

    card.querySelector(".btn-agendar").addEventListener("click", () => {
      const usuarioLogueado = localStorage.getItem("token");

      if (usuarioLogueado) {
        localStorage.setItem("servicioSeleccionadoNombre", s.nombre);
        window.location.href = "../pages/profile.html#reservas";
      } else {
        window.location.href = "../pages/Login.html";
      }
    });

    servicesGrid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", cargarServiciosDesdeServidor);
