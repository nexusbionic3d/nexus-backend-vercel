// C:\NexusBionic\nexus-backend-vercel\api\analizarUsuario.js

import express from 'express';
import cors from 'cors';

const app = express();

// Configurar CORS para permitir solicitudes desde tu frontend en Vercel
// Asegúrate de que esta URL sea la de tu frontend desplegado
app.use(cors({
  origin: 'https://nexus-bionic-frontend.vercel.app', // Permite solo tu frontend
  methods: ['POST'], // Permite solo el método POST
}));

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

app.post('/api/analizarUsuario', (req, res) => {
  // Asegurarse de que la solicitud es POST (esto es redundante si solo usamos app.post, pero es buena práctica)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', mensaje: 'Se espera un método POST.' });
  }

  // EXTRAER EL TEXTO DEL CUERPO DE LA SOLICITUD (¡CAMBIO CLAVE AQUÍ!)
  const { texto } = req.body;

  // Validar que el texto exista y no esté vacío
  if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
    return res.status(400).json({ error: 'Bad Request', mensaje: 'El campo "texto" es requerido y no puede estar vacío.' });
  }

  // Lógica de análisis de texto (simulada por ahora)
  let resumen = "No se detectaron patrones específicos. Se recomienda evaluación profesional para mayor precisión.";
  let mensaje = "Texto analizado correctamente";

  // Aquí podrías agregar lógica para analizar el texto, por ejemplo:
  if (texto.toLowerCase().includes("panza") || texto.toLowerCase().includes("dolor de cabeza")) {
    resumen = "Posibles síntomas digestivos o tensionales. Se recomienda hidratación y descanso.";
  } else if (texto.toLowerCase().includes("cansancio")) {
    resumen = "Considerar niveles de energía y hábitos de sueño. Posiblemente relacionado con fatiga.";
  } else if (texto.toLowerCase().includes("abductor")) { // Añadimos una simulación para el caso del abductor
    resumen = "Molestias en el abductor. Se recomienda reposo y aplicación de frío/calor según indicación médica.";
  }

  const fechaAnalisis = new Date().toISOString(); // Fecha en formato ISO

  res.status(200).json({
    mensaje: mensaje,
    resumen: resumen,
    fecha: fechaAnalisis,
  });
});

// Exporta la aplicación Express como una función serverless para Vercel
export default app;