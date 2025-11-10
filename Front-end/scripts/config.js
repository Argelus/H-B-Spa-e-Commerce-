// scripts/config.js
(function () {
  if (localStorage.getItem("API_BASE")) return;
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const API_BASE = isLocal
    ? "http://localhost:8080/api"               // DEV
    : "https://TU-APP.railway.app/api";         // PROD

  localStorage.setItem("API_BASE", API_BASE);
})();
