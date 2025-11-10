// scripts/login.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080/api";
  const form = document.getElementById("loginForm");
  const successMsg = document.getElementById("successMsg");
  const errorMsg = document.getElementById("errorMsg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("email")?.value || "").trim(); 
    const password = (document.getElementById("password")?.value || "").trim();

    if (successMsg) successMsg.classList.add("d-none");
    if (errorMsg) errorMsg.classList.add("d-none");

    if (!username || !password) {
      if (errorMsg) {
        errorMsg.textContent = "Ingresa usuario/correo y contraseña.";
        errorMsg.classList.remove("d-none");
      }
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const original = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Ingresando...'; }

    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (resp.ok) {
        // guardar sesión
        if (data.token) localStorage.setItem("token", data.token);
        if (data.username) localStorage.setItem("username", data.username);
        if (data.role) localStorage.setItem("role", data.role);

        if (successMsg) {
          successMsg.textContent = "Inicio de sesión exitoso.";
          successMsg.classList.remove("d-none");
        }

        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        setTimeout(() => {
          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
          } else {
            window.location.href = "./profile.html";
          }
        }, 600); 

        // redirigir a perfil
        setTimeout(() => { window.location.href = "./profile.html"; }, 600);
      } else {
        if (errorMsg) {
          errorMsg.textContent = data.message || "Usuario o contraseña incorrectos.";
          errorMsg.classList.remove("d-none");
        }
      }
    } catch (err) {
      if (errorMsg) {
        errorMsg.textContent = "Error de conexión con el servidor.";
        errorMsg.classList.remove("d-none");
      }
      console.error(err);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = original; }
    }
  });
});
