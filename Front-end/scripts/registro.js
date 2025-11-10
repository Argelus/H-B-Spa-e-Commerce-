document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const mensaje = document.getElementById("mensaje");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    mensaje.innerText = "";
    mensaje.className = "";

    if (password !== confirmPassword) {
      mensaje.innerText = "Las contraseñas no coinciden.";
      mensaje.className = "text-danger";
      return;
    }

    const datos = {
      username: nombre,
      email: email,
      password: password,
      role: "user"
    };

    try {
      const respuesta = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (respuesta.ok) {
        const data = await respuesta.json();

        mensaje.innerText = data.message || "Usuario registrado correctamente 🎉";
        mensaje.className = "text-success";

        form.reset();

        setTimeout(() => {
          mensaje.innerText = "";
        }, 4000);

        if (data.token) localStorage.setItem("token", data.token);

      } else {
        const error = await respuesta.text();
        mensaje.innerText = "❌ Error: " + error;
        mensaje.className = "text-danger";
      }
    } catch (err) {
      mensaje.innerText = "Error de conexión con el servidor.";
      mensaje.className = "text-danger";
      console.error("⚠️ Error de conexión:", err);
    }
  });
});
