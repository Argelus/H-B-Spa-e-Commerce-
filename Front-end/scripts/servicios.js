const API_URL = "http://localhost:8080/api";

let servicios = [];
let servicioSeleccionado = null;

function mostrarAlerta(tipo, mensaje) {
  const alertas = document.querySelectorAll(".alert");
  alertas.forEach((a) => a.classList.remove("show"));

  const alerta = document.getElementById(
    tipo === "success" ? "alertSuccess" : "alertError"
  );
  alerta.textContent = mensaje;
  alerta.classList.add("show");

  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => alerta.classList.remove("show"), 6000);
}

async function cargarServicios() {
  try {
    const response = await fetch(`${API_URL}/spa-services`);
    if (!response.ok)
      throw new Error(`Error ${response.status}: No se pueden obtener los servicios`);

    servicios = await response.json();

    llenarSelectServicios();
    mostrarCardsServicios();

    document.getElementById("loadingServices").classList.add("hidden");
    document.getElementById("reservaForm").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loadingServices").innerHTML = `
      <p class="server-error">
        ⚠️ No se pudo conectar con el servidor<br>
      </p>`;
  }
}

function llenarSelectServicios() {
  const select = document.getElementById("selectedServiceId");
  select.innerHTML = `<option value="">-- Selecciona un servicio --</option>`;
  servicios.forEach((servicio) => {
    const option = document.createElement("option");
    option.value = servicio.id;
    option.textContent = `${servicio.name} - $${servicio.price.toFixed(2)} (${servicio.duration || "60 min"})`;
    select.appendChild(option);
  });

  // Sincroniza selección del select con las cards
  select.addEventListener("change", (e) => {
    const id = parseInt(e.target.value);
    servicioSeleccionado = servicios.find((s) => s.id === id) || null;

    document.querySelectorAll(".service-card").forEach((card) => {
      card.classList.remove("selected");
      if (parseInt(card.dataset.id) === id) {
        card.classList.add("selected");
      }
    });
  });
}

function mostrarCardsServicios() {
  const grid = document.getElementById("servicesGrid");

  if (servicios.length === 0) {
    grid.innerHTML = `<p class="placeholder">No hay servicios disponibles</p>`;
    return;
  }

  grid.classList.remove("placeholder");
  grid.innerHTML = servicios
    .map(
      (servicio) => `
      <div class="service-card" data-id="${servicio.id}" onclick="seleccionarServicio(${servicio.id}, event)">
  <div class="service-image" style="background-image: url('${servicio.imageUrl || 'https://via.placeholder.com/300x200'}');"></div>
  <div class="service-overlay">
    <h3>${servicio.name}</h3>
    <p>${servicio.description || "Servicio profesional de spa"}</p>
    <div class="service-info">
      <span class="service-price">$${servicio.price.toFixed(2)}</span>
      <span class="service-duration">⏱️ ${servicio.duration || "60 min"}</span>
    </div>
  </div>
</div>`
    )
    .join("");
}

function seleccionarServicio(serviceId, event) {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.classList.remove("selected");
  });

  event.currentTarget.classList.add("selected");
  servicioSeleccionado = servicios.find((s) => s.id === serviceId);

  // Sincroniza la selección con el <select>
  document.getElementById("selectedServiceId").value = serviceId;
}

async function enviarReserva(event) {
  event.preventDefault();

  if (!servicioSeleccionado) {
    mostrarAlerta("error", "❌ Por favor selecciona un servicio");
    return;
  }

  const datos = {
    usuario: { correo: document.getElementById("correo").value },
    spaService: { id: servicioSeleccionado.id },
    fechaReserva: document.getElementById("fechaReserva").value,
    horaReserva: document.getElementById("horaReserva").value,
    telefono: document.getElementById("telefono").value,
    nota: document.getElementById("nota").value || null,
    estado: "PENDIENTE",
  };

  const btnSubmit = document.getElementById("submitBtn");
  btnSubmit.disabled = true;
  btnSubmit.textContent = "⏳ Procesando reserva...";

  try {
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al crear la reserva");
    }

    const reserva = await response.json();
    mostrarAlerta(
      "success",
      `✅ ¡Reserva confirmada!
       Tu cita para ${reserva.spaService.name}
       el ${datos.fechaReserva} a las ${datos.horaReserva}
       ha sido registrada.`
    );

    document.getElementById("reservaForm").reset();
    document.querySelectorAll(".service-card").forEach((c) => c.classList.remove("selected"));
    servicioSeleccionado = null;
    document.getElementById("selectedServiceId").value = "";
  } catch (error) {
    console.error("Error:", error);
    mostrarAlerta("error", "❌ Error al crear la reserva: " + error.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "📅 Confirmar mi Reserva";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fechaReserva").min = hoy;

  cargarServicios();
  document.getElementById("reservaForm").addEventListener("submit", enviarReserva);
});
