// scripts/recuperacion.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = localStorage.getItem("API_BASE") || "http://localhost:8080/api";

  // 1
  const formEmail = document.getElementById("recuperarForm");
  const emailInput = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");

  // 2
  const formReset = document.getElementById("resetForm");
  const codeInput = document.getElementById("otpCode");
  const newPassInput = document.getElementById("newPassword");
  const mensajeReset = document.getElementById("mensajeReset");

  let lastEmail = "";

  if (formEmail) {
    formEmail.addEventListener("submit", async (e) => {
      e.preventDefault();
      cleanMsg(mensaje);

      const email = (emailInput.value || "").trim();
      if (!email) {
        setMsg(mensaje, "Ingresa tu correo electrónico registrado.", "danger");
        return;
      }

      const btn = formEmail.querySelector("button[type='submit']");
      const prev = lockBtn(btn, "Enviando...");

      try {
        const resp = await fetch(`${API_BASE}/auth/password/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }) // ForgotRequest{ email }
        });

        setMsg(mensaje, "Si el correo existe, te enviamos un código de verificación. Revisa tu bandeja.", "success");

        lastEmail = email;
        if (formReset) formReset.classList.remove("d-none");

      } catch (err) {
        console.error("Error forgot:", err);
        setMsg(mensaje, "Error de conexión. Intenta de nuevo.", "danger");
      } finally {
        unlockBtn(btn, prev);
      }
    });
  }

  // -código + nueva contraseña 
  if (formReset) {
    formReset.addEventListener("submit", async (e) => {
      e.preventDefault();
      cleanMsg(mensajeReset);

      const code = (codeInput.value || "").trim();
      const newPassword = (newPassInput.value || "").trim();

      if (!lastEmail) {
        setMsg(mensajeReset, "Primero solicita el código con tu correo.", "danger");
        return;
      }
      if (!code) {
        setMsg(mensajeReset, "Ingresa el código de verificación.", "danger");
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        setMsg(mensajeReset, "La nueva contraseña debe tener al menos 8 caracteres.", "danger");
        return;
      }

      const btn = formReset.querySelector("button[type='submit']");
      const prev = lockBtn(btn, "Actualizando...");

      try {
        const resp = await fetch(`${API_BASE}/auth/password/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // ResetRequest{ email, code, newPassword }
          body: JSON.stringify({ email: lastEmail, code, newPassword })
        });

        if (resp.ok) {
          setMsg(mensajeReset, "¡Contraseña actualizada! Ya puedes iniciar sesión.", "success");
          formReset.reset();

          setTimeout(() => {
            window.location.href = "./Login.html";
          }, 1500);

        } else {
          const txt = await resp.text().catch(() => "");
          console.warn("reset non-200:", txt);
          setMsg(mensajeReset, "No se pudo actualizar. Verifica el código y el tiempo de validez.", "danger");
        }

      } catch (err) {
        console.error("Error reset:", err);
        setMsg(mensajeReset, "Error de conexión. Intenta de nuevo.", "danger");
      } finally {
        unlockBtn(btn, prev);
      }
    });
  }

  // Helpers UI
  function setMsg(el, text, kind = "success") {
    if (!el) return;
    el.textContent = text;
    el.className = `mt-3 text-center fw-bold text-${kind}`;
  }
  function cleanMsg(el) {
    if (!el) return;
    el.textContent = "";
    el.className = "mt-3 text-center fw-bold";
  }
  function lockBtn(btn, loadingText) {
    if (!btn) return null;
    const prev = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${loadingText}`;
    return prev;
  }
  function unlockBtn(btn, prev) {
    if (!btn) return;
    btn.disabled = false;
    if (prev) btn.innerHTML = prev;
  }
});