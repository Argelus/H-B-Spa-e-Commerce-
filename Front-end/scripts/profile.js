document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080/api";
  const token = localStorage.getItem("token");

  // 🔐 Si no hay token -> a login
  if (!token) {
    window.location.href = "./Login.html";
    return;
  }

  // Helper: fetch con auth
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
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
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

  // Cargar historial de compras
  (async () => {
    if (!listaOrdenes) return;
    try {
      const r = await authFetch(`${API_BASE}/orders/mine`);
      const ordenes = await r.json();
      if (!Array.isArray(ordenes) || ordenes.length === 0) {
        listaOrdenes.innerHTML = '<li class="list-group-item text-muted">Aún no has realizado compras.</li>';
        return;
      }
      listaOrdenes.innerHTML = ordenes.map(o => {
        const fecha = o.fechaCreacion || "";
        const total = (o.total != null) ? `$${Number(o.total).toFixed(2)}` : "$0.00";
        const estado = o.estado || "—";
        return `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Orden #${o.id}${fecha ? ` – ${fecha}` : ""}</span>
            <span class="text-muted small me-3">${estado}</span>
            <span class="badge bg-info rounded-pill">${total}</span>
          </li>
        `;
      }).join("");
    } catch (e) {
      console.error("Error órdenes:", e);
      listaOrdenes.innerHTML = '<li class="list-group-item text-danger">Error al cargar compras.</li>';
    }
  })();

  // Navegación por hash
  const seccionHash = window.location.hash?.replace("#", "");
  if (seccionHash && ["datos", "password", "reservas", "historial"].includes(seccionHash)) {
    mostrarSeccion(seccionHash);

    // Seleccionar servicio si viene de botón "Agendar"
    if (seccionHash === "reservas") {
      const servicioGuardado = localStorage.getItem("servicioSeleccionado");
      if (servicioGuardado) {
        const select = document.getElementById("selectedServiceId");
        const intentarSeleccionar = () => {
          const opciones = Array.from(select.options);
          const opcion = opciones.find(opt => opt.textContent.trim() === servicioGuardado.trim());
          if (opcion) {
            opcion.selected = true;
            localStorage.removeItem("servicioSeleccionado");
          } else {
            setTimeout(intentarSeleccionar, 300);
          }
        };
        intentarSeleccionar();
      }
    }
  }
});
