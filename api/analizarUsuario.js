const cors = require('cors')({ origin: true });

module.exports = async (req, res) => {
  await new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nombre, edad } = req.body;

  // Aquí va la lógica que quieres ejecutar
  res.json({ mensaje: `Hola, ${nombre}`, edadRecibida: edad });
};
