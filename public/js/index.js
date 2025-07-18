import { renderCarrusel, initSwiper } from './utils.js';

const API_BASE_URL = location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://decantsnap-backend.onrender.com/api";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/productos`);
    const productos = await res.json();

      console.log("✅ Productos recibidos:", productos);

    const tipos = ["nuevo", "nicho", "arabe", "disenador"];
    tipos.forEach(tipo => {
      const filtrados = productos.filter(p => p.tipo === tipo);
      renderCarrusel(filtrados, `swiper-${tipo}`);
      initSwiper(`.${tipo}-swiper`);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
});
