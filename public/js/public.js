export function renderCarrusel(lista, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(producto => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    slide.innerHTML = `
      <div class="producto-card">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img"/>
        <h3>${producto.nombre}</h3>
        <p class="marca">${producto.marca}</p>
        <p class="precio">$${producto.precio}</p>
        <div class="notas">
          <strong>Notas:</strong>
          <p>${producto.notas || "N/A"}</p>
        </div>
      </div>
    `;

    contenedor.appendChild(slide);
  });
}

export function initSwiper(selector) {
  new Swiper(selector, {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
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
