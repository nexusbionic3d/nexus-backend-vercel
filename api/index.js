const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analizarUsuario', (req, res) => {
  const texto = req.body.texto || '';

  if (!texto || texto.trim().length < 5) {
    return res.status(400).json({ mensaje: 'El texto es muy corto o está vacío.' });
  }

  const respuesta = {
    mensaje: "Texto analizado correctamente",
    resumen: `Resumen del texto: ${texto}...`,
    fecha: new Date().toISOString(),
  };

  res.json(respuesta);
});

module.exports = app;
