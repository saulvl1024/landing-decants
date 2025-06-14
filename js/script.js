
document.addEventListener("DOMContentLoaded", () => {
// Arreglo con productos
let productos = JSON.parse(localStorage.getItem("productos")) || [];

  function mostrarProductos(filtrados) {
    const contenedor = document.querySelector(".productos");
    contenedor.innerHTML = "";
  
    filtrados.forEach((producto, index) => {

      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <h3>${producto.marca}</h3>
        <p class= p_nom><strong>${producto.nombre}</strong></p>
        <br>
        <p class= p_enca>Tamaño:</p> <p>${producto.tamano}</p>
        <p class= p_enca>Precio:</p> <p>${producto.precio}</p>
        <p class= p_enca>Descripcion:</p> <p>${producto.descripcion}</p>
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; border-radius: 6px; margin-top: 10px;">
        <button class="editar">Editar</button>
      `;
      contenedor.appendChild(div);

      const botonEditar = div.querySelector(".editar");

    botonEditar.addEventListener("click", () => {
      // Guardamos el índice actual del producto
      formulario.dataset.editarIndice = index;

      // Rellenamos el formulario con los datos
      document.getElementById("marca").value = producto.marca;
      document.getElementById("nombre").value = producto.nombre;
      document.getElementById("tamano").value = producto.tamano;
      document.getElementById("precio").value = producto.precio;
      document.getElementById("descripcion").value = producto.descripcion;
      document.getElementById("imagen").value = producto.imagen.replace("img/", "");
});

  
    });
  }
  mostrarProductos(productos);

  const inputBuscador = document.getElementById("buscador");

inputBuscador.addEventListener("input", () => {
  const texto = inputBuscador.value.toLowerCase();
  const filtrados = productos.filter(p => {
    const textoCompleto = `${p.marca} ${p.nombre}`.toLowerCase();
    return textoCompleto.includes(texto);
  });
  
  mostrarProductos(filtrados);
});

// Captura el formulario
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que se recargue la página

  // Capturar valores del formulario
  const nuevoProducto = {
    marca: document.getElementById("marca").value,
    nombre: document.getElementById("nombre").value,
    tamano: document.getElementById("tamano").value,
    precio: document.getElementById("precio").value,
    descripcion: document.getElementById("descripcion").value,
    imagen: "img/" + (document.getElementById("imagen").value || "default.jpg")

  };

  // Agregar al arreglo y editar el producto
  const indiceEditar = formulario.dataset.editarIndice;

  if (indiceEditar) {
    productos[indiceEditar] = nuevoProducto;
    delete formulario.dataset.editarIndice;
  } else {
    productos.push(nuevoProducto);
  }
  

  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductos(productos);

  // Limpiar el formulario
  formulario.reset();
});

const campos = ["marca", "nombre", "tamano", "precio", "descripcion", "imagen"];

campos.forEach(campo => {
  localStorage.removeItem("form_" + campo);
});


campos.forEach(campo => {
  const input = document.getElementById(campo);
  input.addEventListener("input", () => {
    localStorage.setItem("form_" + campo, input.value);
  });
});

campos.forEach(campo => {
  const valorGuardado = localStorage.getItem("form_" + campo);
  if (valorGuardado) {
    document.getElementById(campo).value = valorGuardado;
  }
});

campos.forEach(campo => {
  localStorage.removeItem("form_" + campo);
});



  });
