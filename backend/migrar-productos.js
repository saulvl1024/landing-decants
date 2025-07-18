// backend/migrar-productos.js
const fs = require('fs');
const mongoose = require('mongoose');
const Producto = require('./models/producto');

// 🔐 URI de conexión a tu MongoDB Atlas
const MONGO_URI = 'mongodb+srv://saulvl2697:KyDLvHTCUKNZOXIk@decantsnapcluster.hh7wl54.mongodb.net/decantsdb?retryWrites=true&w=majority&appName=DecantSnapcluster';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Conectado a MongoDB');

  const data = fs.readFileSync('./productos.json', 'utf8');
  const productos = JSON.parse(data);

  // Limpia la colección antes de insertar (opcional)
  await Producto.deleteMany({});

  // Inserta los productos
  await Producto.insertMany(productos);
  console.log(`🛒 ${productos.length} productos migrados a MongoDB`);

  mongoose.disconnect();
})
.catch(err => {
  console.error('❌ Error:', err);
});
