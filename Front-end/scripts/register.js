// scripts/register.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const mensaje = document.getElementById("mensaje");
  const btn = document.getElementById("btnRegistro");

  if (!form) return;

  // Detecta API base (puedes ajustar con localStorage.setItem("API_BASE", "https://tu-app.railway.app/api"))
  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080/api";

  // Validación visual Bootstrap
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.classList.add("was-validated");

    // datos del form
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim(); // de momento solo se usa al reservar
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // mensajes
    mensaje.textContent = "";
    mensaje.className = "mt-3 text-center fw-bold";

    // validaciones mínimas
    if (!nombre || !email || !password || !confirmPassword) {
      mensaje.textContent = "Por favor, completa todos los campos.";
      mensaje.classList.add("text-danger");
      return;
    }
    if (password !== confirmPassword) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      mensaje.classList.add("text-danger");
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      mensaje.textContent = "El teléfono debe tener 10 dígitos.";
      mensaje.classList.add("text-danger");
      return;
    }

    // armar payload (NO enviar phone; backend actual no lo guarda en registro)
    const payload = { username: nombre, email, password };

    try {
      // deshabilitar botón para evitar doble submit
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando...';

      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // intenta parsear JSON; si no, texto
      let data;
      const text = await resp.text();
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (resp.ok) {
        // mensaje de éxito
        mensaje.textContent = (data && data.message) ? data.message : "Usuario registrado correctamente 🎉";
        mensaje.classList.remove("text-danger");
        mensaje.classList.add("text-success");

        // guardar token si lo envía
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username || nombre);
          localStorage.setItem("role", data.role || "ROLE_USER");
        }

        // limpiar form
        form.reset();
        form.classList.remove("was-validated");

        // redirigir a login (o directo a perfil si prefieres)
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1200);
      } else {
        // mostrar error legible
        const msg = (data && data.message) ? data.message : (text || "Error al registrar.");
        mensaje.textContent = `❌ ${msg}`;
        mensaje.classList.add("text-danger");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      mensaje.textContent = "Error de conexión con el servidor.";
      mensaje.classList.add("text-danger");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-person-plus me-2"></i>Registrarse';
    }
  });
});
