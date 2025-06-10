// C:\NexusBionic\nexus-backend-vercel\api\analizarUsuario.js
const cors = require('cors')({ origin: true });

module.exports = async (req, res) => {
  // Manejo de CORS para la solicitud actual
  await new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });

  // Asegurarse de que la solicitud sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', mensaje: 'Se espera un método POST.' });
  }

  const texto = req.body.texto || '';

  // Validación del texto
  if (!texto || texto.trim().length < 5) {
    return res.status(400).json({ mensaje: 'El texto es muy corto o está vacío.' });
  }

  // Simula el análisis (aquí iría tu lógica de IA real)
  const respuesta = {
    mensaje: "Texto analizado correctamente",
    resumen: `Resumen del texto: ${texto}...`,
    fecha: new Date().toISOString(),
  };

  res.json(respuesta);
};