const API_BASE_URL = location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://decantsnap-backend.onrender.com/api";

const formulario = document.getElementById('formulario-producto');
const mensaje = document.getElementById('mensaje');
const presentacionesDiv = document.getElementById('presentaciones');
const agregarPresentacionBtn = document.getElementById('agregar-presentacion');
const previewImg = document.getElementById('preview-img');

// Mostrar preview de imagen
document.getElementById('imagenUrl').addEventListener('input', (e) => {
  const url = e.target.value;
  if (url) {
    previewImg.src = url;
    previewImg.style.display = 'block';
  } else {
    previewImg.style.display = 'none';
  }
});

// Agregar nueva presentación
agregarPresentacionBtn.addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'presentacion-item';

  div.innerHTML = `
    <input type="text" placeholder="Tamaño (ej. 5ml)" class="tamano" required>
    <input type="text" placeholder="Precio (ej. $150)" class="precio" required>
    <button type="button" class="eliminar">🗑️</button>
  `;

  div.querySelector('.eliminar').addEventListener('click', () => {
    div.remove();
  });

  presentacionesDiv.appendChild(div);
});

// Enviar formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const presentaciones = Array.from(document.querySelectorAll('.presentacion-input')).map(div => ({
    nombre: div.querySelector('.input-nombre').value,
    precio: parseFloat(div.querySelector('.input-precio').value),
  }));

  const producto = {
    nombre: document.getElementById('nombre').value,
    marca: document.getElementById('marca').value,
    descripcion: document.getElementById('descripcion').value,
    imagen: document.getElementById('imagenUrl').value,
    notas: document.getElementById('notas').value.split(',').map(n => n.trim()),
    tipo: document.getElementById('tipo').value,
    presentaciones
  };

  const id = formulario.dataset.editandoId;

  try {
    const res = await fetch(`${API_BASE_URL}/productos${id ? `/${id}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });

    if (res.ok) {
      mensaje.textContent = id ? '✅ Producto actualizado' : '✅ Producto agregado';
      formulario.reset();
      formulario.removeAttribute('data-editando-id');
      document.getElementById('presentaciones').innerHTML = '';
      cargarProductos();
    } else {
      mensaje.textContent = '❌ Error al guardar';
    }
  } catch (error) {
    console.error(error);
    mensaje.textContent = '❌ Error de conexión';
  }
});


async function cargarProductos() {
  const res = await fetch(`${API_BASE_URL}/productos`);
  const productos = await res.json();

  const tbody = document.querySelector('#tabla-productos tbody');
  tbody.innerHTML = '';

  productos.forEach((p, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.marca}</td>
      <td>${p.tipo}</td>
      <td>${p.presentaciones?.[0]?.precio || 'N/A'}</td>
      <td>
        <button class="btn-editar" onclick="editarProducto('${p._id}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarProducto('${p._id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

window.addEventListener('DOMContentLoaded', cargarProductos);

async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este perfume?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('✅ Producto eliminado con éxito');
      cargarProductos(); // Recargar la tabla
    } else {
      alert('❌ Error al eliminar el producto');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('❌ Error de conexión al eliminar');
  }
}

async function editarProducto(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/productos`);
    const productos = await res.json();
    const producto = productos.find(p => p._id === id);

    if (!producto) return alert('❌ Producto no encontrado');

    // Rellenar el formulario
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('marca').value = producto.marca;
    document.getElementById('descripcion').value = producto.descripcion;
    document.getElementById('imagenUrl').value = producto.imagen;
    document.getElementById('notas').value = producto.notas?.join(', ');
    document.getElementById('tipo').value = producto.tipo;

    // Eliminar presentaciones previas
    document.getElementById('presentaciones').innerHTML = '';

    producto.presentaciones?.forEach(pres => {
      const contenedor = document.createElement('div');
      contenedor.className = 'presentacion-input';
      contenedor.innerHTML = `
        <input type="text" value="${pres.nombre}" placeholder="Ej: 5ml" class="input-nombre" />
        <input type="number" value="${pres.precio}" placeholder="Precio" class="input-precio" />
        <button type="button" class="btn-eliminar-pres">❌</button>
      `;
      document.getElementById('presentaciones').appendChild(contenedor);
    });

    // Guardar el ID temporalmente
    formulario.dataset.editandoId = id;

  } catch (error) {
    console.error('Error al editar:', error);
    alert('❌ Error al cargar producto');
  }
}
