// scripts/config.js
(function () {
  // Si ya está definido, no lo toques
  if (localStorage.getItem("API_BASE")) return;

  // Detecta entorno automáticamente (ajusta si quieres)
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const API_BASE = isLocal
    ? "http://localhost:8080/api"               // DEV
    : "https://TU-APP.railway.app/api";         // PROD (cambia por tu URL real)

  localStorage.setItem("API_BASE", API_BASE);
})();
