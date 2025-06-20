document.addEventListener("DOMContentLoaded", () => {

const API_BASE_URL = location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://decantsnap-backend.onrender.com/api";

  let productos = [];

  const formulario = document.getElementById("formulario");
  const inputBuscador = document.getElementById("buscador");
  const campos = ["marca", "nombre", "tamano", "precio", "descripcion", "imagen"];

  function mostrarProductos(filtrados) {
    const contenedor = document.querySelector(".productos");
    contenedor.innerHTML = "";

    filtrados.forEach((producto, index) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <h3>${producto.marca}</h3>
        <p class="p_nom"><strong>${producto.nombre}</strong></p>
        <br>
        <p class="p_enca">Tamaño:</p> <p>${producto.tamano}</p>
        <p class="p_enca">Precio:</p> <p>${producto.precio}</p>
        <p class="p_enca">Descripción:</p> <p>${producto.descripcion}</p>
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; border-radius: 6px; margin-top: 10px;">
        <button class="editar" style="background-color:rgb(119, 108, 112); color: white;">Editar</button>
        <button class="eliminar" style="margin-top: 5px; background-color:rgb(57, 56, 56); color: white;">Eliminar</button>
      `;
      contenedor.appendChild(div);

      const botonEditar = div.querySelector(".editar");

      botonEditar.addEventListener("click", () => {
        formulario.dataset.editarIndice = index;
        document.getElementById("marca").value = producto.marca;
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("tamano").value = producto.tamano;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("imagen").value = producto.imagen.replace("img/", "");
      });

      

      //ELIMINAR DELETE
      const botonEliminar = div.querySelector(".eliminar");
        botonEliminar.addEventListener("click", () => {
          console.log("Click en botón eliminar", index);
          alert("¡Detectado clic en botón eliminar!");//
          if (confirm("¿Seguro que quieres eliminar este producto?")) {
          fetch(`${API_BASE_URL}/productos/${index}`, {

            method: "DELETE"
          })
            .then(res => res.json())
            .then(() => {
              
              cargarProductos();
            })
            .catch(err => console.error("Error al eliminar:", err));
          }
        });
    });
  
  }

    
  function cargarProductos() {
    fetch(`${API_BASE_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        productos = data;
        mostrarProductos(productos);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
      });
  }

  //BUSCADOR
  inputBuscador.addEventListener("input", () => {
    const texto = inputBuscador.value.toLowerCase();
    const filtrados = productos.filter(p => {
      const textoCompleto = `${p.marca} ${p.nombre}`.toLowerCase();
      return textoCompleto.includes(texto);
    });
    mostrarProductos(filtrados);
  });

  //LLENADO DE FORMULARIO./....
formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevoProducto = {
    marca: document.getElementById("marca").value,
    nombre: document.getElementById("nombre").value,
    tamano: document.getElementById("tamano").value,
    precio: document.getElementById("precio").value,
    descripcion: document.getElementById("descripcion").value,
    imagen: "img/" + (document.getElementById("imagen").value || "default.jpg")
  };

  const indiceEditar = formulario.dataset.editarIndice;

  if (indiceEditar) {
    productos[indiceEditar] = nuevoProducto;
    delete formulario.dataset.editarIndice;
    mostrarProductos(productos);
  } else {
    // //AGREGAR POST
    fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        productos.push(nuevoProducto);
        mostrarProductos(productos);
        formulario.reset();
      })
      .catch(err => console.error("Error al enviar producto:", err));
  }
});


  campos.forEach(campo => {
    const input = document.getElementById(campo);
    input.addEventListener("input", () => {
      localStorage.setItem("form_" + campo, input.value);
    });
  });

  campos.forEach(campo => {
    const valor = localStorage.getItem("form_" + campo);
    if (valor) document.getElementById(campo).value = valor;
  });

  cargarProductos();
});
