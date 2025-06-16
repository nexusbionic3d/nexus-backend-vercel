require('dotenv').config();
const express = require('express');
const analizarUsuario = require('./api/analizarUsuario');

const app = express();
app.use(express.json());

// Ruta local que simula Vercel
app.post('/api/analizarUsuario', analizarUsuario);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor local corriendo en http://localhost:${PORT}`);
});
