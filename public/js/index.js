import { renderCarrusel, initSwiper } from './utils.js';

// Siempre usar la URL del backend en Render
// config.js
import { API_BASE_URL } from '../../models/config.js';



document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/productos`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    const productos = await res.json();
    console.log("✅ Productos recibidos:", productos);

    const tipos = ["nuevo", "nicho", "arabe", "disenador"];
    tipos.forEach(tipo => {
      const filtrados = productos.filter(p => p.tipo === tipo);
      renderCarrusel(filtrados, `swiper-${tipo}`);
      initSwiper(`.${tipo}-swiper`);
    });

  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    alert("Error al cargar productos desde el servidor.");
  }
});
