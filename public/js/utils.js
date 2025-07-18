export function renderCarrusel(lista, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(producto => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    // Obtener presentación más económica
    let precioMinimo = "N/A";
    if (Array.isArray(producto.presentaciones) && producto.presentaciones.length > 0) {
      const ordenadas = producto.presentaciones.sort((a, b) => a.precio - b.precio);
      precioMinimo = `$${ordenadas[0].precio} MXN (${ordenadas[0].tamanio})`;
    }

    slide.innerHTML = `
      <div class="producto-card">
        <img src="${producto.imagenUrl}" alt="${producto.nombre}" class="producto-img"/>
        <h3>${producto.nombre}</h3>
        <p class="marca">${producto.marca}</p>
        <p class="precio">${precioMinimo}</p>
        <div class="notas">
          <strong>Notas:</strong>
          <p>${Array.isArray(producto.notas) ? producto.notas.join(", ") : "N/A"}</p>
        </div>
      </div>
    `;

    contenedor.appendChild(slide);
  });
}


export function initSwiper(selector) {
  const container = document.querySelector(`${selector} .swiper-wrapper`);
  const totalSlides = container ? container.children.length : 0;

  new Swiper(selector, {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: totalSlides > 3, // Activamos loop solo si hay suficientes slides
    pagination: {
      el: selector + " .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });
}
