const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta GET para obtener productos
app.get('/api/productos', (req, res) => {
  fs.readFile('./productos.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer productos' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta POST para agregar productos
app.post('/api/productos', (req, res) => {
  const nuevoProducto = req.body;

  fs.readFile('./productos.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer archivo' });

    let productos = JSON.parse(data);
    productos.push(nuevoProducto);

    fs.writeFile('./productos.json', JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar producto' });

      res.status(201).json({ mensaje: 'Producto agregado con éxito' });
    });
  });
});

// Ruta DELETE para eliminar un producto por índice
app.delete('/api/productos/:index', (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile('./productos.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer productos' });

    let productos = JSON.parse(data);

    if (index < 0 || index >= productos.length) {
      return res.status(400).json({ error: 'Índice inválido' });
    }

    productos.splice(index, 1);

    fs.writeFile('./productos.json', JSON.stringify(productos, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al guardar' });

      res.json({ mensaje: 'Producto eliminado con éxito' });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
