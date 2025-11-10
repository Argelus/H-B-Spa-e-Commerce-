const API_URL = "http://localhost:8080/api/auth";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  toggleBtn.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    toggleBtn.innerHTML =
      type === "password" ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.style.display = "none";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");
      const data = await response.json();

      localStorage.setItem("hbspa_token", data.token);

      window.location.href = "admin.html";
    } catch (err) {
      message.textContent = "❌ Usuario o contraseña incorrectos.";
      message.style.display = "block";
    }
  });
});
