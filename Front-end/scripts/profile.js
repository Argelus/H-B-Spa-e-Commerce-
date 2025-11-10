document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080/api";
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "./Login.html";
    return;
  }

  const authFetch = async (url, options = {}) => {
    const opts = { ...options };
    opts.headers = new Headers(opts.headers || {});
    opts.headers.set("Authorization", `Bearer ${token}`);
    const method = (opts.method || "GET").toUpperCase();
    if (method !== "GET" && !opts.headers.has("Content-Type")) {
      opts.headers.set("Content-Type", "application/json");
    }
    const res = await fetch(url, opts);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[authFetch] ${res.status} ${res.statusText} @ ${url}`, text);
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
    }
    return res;
  };

  const nombreEl = document.querySelector(".perfil-nombre");
  const emailEl  = document.querySelector(".perfil-email");
  const listaReservas = document.getElementById("listaReservas");
  const listaOrdenes  = document.getElementById("listaOrdenes");
  const logoutButtons = document.querySelectorAll('[data-profile-logout]');

  logoutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "./Login.html";
    });
  });

  // Cargar datos del usuario
  (async () => {
    try {
      const r = await authFetch(`${API_BASE}/usuarios/me`);
      const user = await r.json();
      nombreEl && (nombreEl.textContent = user.username || "Usuario");
      emailEl  && (emailEl.textContent  = user.email || "");
      localStorage.setItem("userId", user.id);
      document.getElementById("inpNombre").value = user.username || "";
      document.getElementById("inpEmail").value = user.email || "";
    } catch (e) {
      console.error("Error perfil:", e);
      alert("Tu sesión expiró o no es válida. Inicia sesión nuevamente.");
      window.location.href = "./Login.html";
    }
  })();

  // Cargar reservas
  (async () => {
    if (!listaReservas) return;
    try {
      const r = await authFetch(`${API_BASE}/reservas/mias`);
      const reservas = await r.json();
      if (!Array.isArray(reservas) || reservas.length === 0) {
        listaReservas.innerHTML = '<li class="list-group-item text-muted">No tienes reservas aún.</li>';
        return;
      }
      listaReservas.innerHTML = reservas.map(rv => {
        const servicio = rv.spaService?.name || "Servicio";
        const fecha = rv.fechaReserva || "";
        const hora  = rv.horaReserva || "";
        const estado = rv.estado || "—";
        const badge =
          estado === "CONFIRMADA" ? "bg-success"
          : estado === "PENDIENTE" ? "bg-warning text-dark"
          : "bg-secondary";
        return `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${servicio} — ${fecha}${hora ? `, ${hora}` : ""}
            <span class="badge ${badge} rounded-pill">${estado}</span>
          </li>
        `;
      }).join("");
    } catch (e) {
      console.error("Error reservas:", e);
      listaReservas.innerHTML = '<li class="list-group-item text-danger">Error al cargar reservas.</li>';
    }
  })();

  // Mostrar servicio seleccionado
  function mostrarServicioSeleccionado() {
    const servicioNombre = localStorage.getItem("servicioSeleccionadoNombre");
    const textoEl = document.getElementById("servicioSeleccionadoTexto");

    if (servicioNombre && textoEl) {
      textoEl.textContent = servicioNombre;
      localStorage.removeItem("servicioSeleccionadoNombre");
    } else if (textoEl) {
      textoEl.textContent = "No se ha seleccionado ningún servicio.";
    }
  }

  // Navegación por hash
  const seccionHash = window.location.hash?.replace("#", "");
  if (seccionHash && ["datos", "password", "reservas", "historial"].includes(seccionHash)) {
    mostrarSeccion(seccionHash);
    if (seccionHash === "reservas") {
      mostrarServicioSeleccionado();
    }
  }
});
